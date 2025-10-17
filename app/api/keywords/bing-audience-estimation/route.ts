import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { KeywordsDataBingAudienceEstimationLiveRequestInfo } from 'dataforseo-client';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      location = 'Germany',
      age = [],
      gender = [],
      industry = [],
      job_function = [],
      bid,
      daily_budget
    } = body;

    // Validate required parameters
    if (!bid || bid <= 0) {
      return NextResponse.json(
        { error: 'Bid is required and must be greater than 0' },
        { status: 400 }
      );
    }

    if (!daily_budget || daily_budget <= 0) {
      return NextResponse.json(
        { error: 'Daily budget is required and must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate bid and daily_budget limits
    if (bid > 1000) {
      return NextResponse.json(
        { error: 'Bid must be maximum 1000' },
        { status: 400 }
      );
    }

    if (daily_budget > 10000) {
      return NextResponse.json(
        { error: 'Daily budget must be maximum 10000' },
        { status: 400 }
      );
    }

    // Check credits (5 credits per request)
    const requiredCredits = 5;
    await checkUserCredits(user.id, requiredCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { location, age, gender, industry, job_function, bid, daily_budget },
      'bing_audience_estimation',
      user.id,
      undefined,
      requiredCredits
    );

    try {
      // Create DataForSEO request
      const request = new KeywordsDataBingAudienceEstimationLiveRequestInfo();
      request.location_name = location;
      request.bid = bid;
      request.daily_budget = daily_budget;
      
      if (age && age.length > 0) request.age = age;
      if (gender && gender.length > 0) request.gender = gender;
      if (industry && industry.length > 0) request.industry = industry;
      if (job_function && job_function.length > 0) request.job_function = job_function;

      logger.info('Sending Bing Audience Estimation request to DataForSEO:', {
        location,
        age,
        gender,
        industry,
        job_function,
        bid,
        daily_budget
      });

      // Call DataForSEO API with retry logic
      let result;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          result = await dataForSeoClient.keywords.bingAudienceEstimationLive([request]);
          break; // Success, exit retry loop
        } catch (retryError) {
          retryCount++;
          logger.warn(`DataForSEO API attempt ${retryCount} failed:`, retryError);
          if (retryCount >= maxRetries) {
            throw retryError; // Re-throw the last error
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      logger.info('DataForSEO API Response:', JSON.stringify(result, null, 2));

      // Check if we have valid results
      if (!result?.tasks?.[0]?.result?.[0]) {
        logger.info('No Bing Audience Estimation data found in DataForSEO response');
        await updateAnalysis(analysisRecord.id, {
          status: 'completed',
          result: {}
        });
        
        return NextResponse.json({
          success: true,
          data: {},
          analysisId: analysisRecord.id,
          creditsUsed: 0,
          message: 'No Bing Audience Estimation data found',
          source: 'DataForSEO API'
        });
      }
      
      // Verify DataForSEO data structure
      const taskResult = result.tasks[0].result[0];
      if (!taskResult) {
        throw new Error('Invalid DataForSEO data structure - no result found');
      }
      
      logger.info('✅ DataForSEO data verified - contains valid Bing Audience Estimation structure');

      // Process results
      const processedResult = {
        estimated_audience_size: taskResult.estimated_audience_size || 0,
        estimated_clicks: taskResult.estimated_clicks || 0,
        estimated_impressions: taskResult.estimated_impressions || 0,
        estimated_spend: taskResult.estimated_spend || 0,
        cost_per_click: taskResult.cost_per_click || 0,
        audience_data: {
          age: age,
          gender: gender,
          industry: industry,
          job_function: job_function,
          location: location,
          bid: bid,
          daily_budget: daily_budget
        },
        api_info: {
          se_type: 'bing_audience_estimation',
          last_updated_time: new Date().toISOString()
        }
      };

      // Debug logging
      logger.info('Processed Bing Audience Estimation Result:', JSON.stringify(processedResult, null, 2));

      // Update analysis with results
      await updateAnalysis(analysisRecord.id, {
        status: 'completed',
        result: processedResult
      });

      // Deduct credits
      await deductCredits(user.id, requiredCredits);

      return NextResponse.json({
        success: true,
        data: processedResult,
        analysisId: analysisRecord.id,
        creditsUsed: requiredCredits,
        source: 'DataForSEO API',
        apiEndpoint: 'bingAudienceEstimationLive',
        timestamp: new Date().toISOString(),
        dataForSeoTaskId: result.tasks[0].id
      });

    } catch (apiError) {
      logger.error('DataForSEO Bing Audience Estimation API Error:', apiError);
      
      // Update analysis with error
      await updateAnalysis(analysisRecord.id, {
        status: 'failed',
        result: { error: 'API call failed' }
      });

      // Enhanced error handling
      let errorMessage = 'Fehler beim Abrufen der Bing Audience Estimation Daten. Bitte versuche es erneut.';
      
      if (apiError instanceof Error) {
        if (apiError.message.includes('ECONNRESET') || 
            apiError.message.includes('aborted') || 
            apiError.message.includes('network')) {
          errorMessage = 'Verbindungsfehler zur DataForSEO API. Bitte versuche es in ein paar Sekunden erneut.';
        } else if (apiError.message.includes('Invalid DataForSEO data structure')) {
          errorMessage = 'Ungültige Datenstruktur von DataForSEO. Bitte kontaktiere den Support.';
        } else {
          errorMessage = `API-Fehler: ${apiError.message}`;
        }
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          success: false 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Bing Audience Estimation API Error:', error);
    
    if (error instanceof Error && error.message.includes('Insufficient credits')) {
      return NextResponse.json(
        { error: error.message },
        { status: 402 }
      );
    }
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false 
      },
      { status: 500 }
    );
  }
}
