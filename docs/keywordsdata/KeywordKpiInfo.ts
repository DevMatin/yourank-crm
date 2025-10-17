export interface IKeywordKpiInfo   {
        
        /** represents the position of the relevant ad in SERP
can take the following values:
FirstPage1: The first ad to appear on the right side of the first search results page
FirstPage2: The second ad to appear on the right side of the first search results page
FirstPage3: The third ad to appear on the right side of the first search results page
FirstPage4: The fourth ad to appear on the right side of the first search results page
FirstPage5: The fifth ad to appear on the right side of the first search results page
FirstPage6: The sixth ad to appear on the right side of the first search results page
FirstPage7: The seventh ad to appear on the right side of the first search results page
FirstPage8: The eighth ad to appear on the right side of the first search results page
FirstPage9: The ninth ad to appear on the right side of the first search results page
FirstPage10: The tenth ad to appear on the right side of the first search results page
MainLine1: The first ad to appear at the top of the search results page
MainLine2: The second ad to appear at the top of the search results page
MainLine3: The third ad to appear at the top of the search results page
MainLine4: The fourth ad to appear at the top of the search results page */
        ad_position?: string
        
        /** ad clicks
the number of clicks that the keyword and match type generated during the last month */
        clicks?: number
        
        /** ad impressions
the number of impressions that the keyword and match type generated during the last month */
        impressions?: number
        
        /** average cost per click, USD
calculated by dividing the cost of all clicks by the number of clicks */
        average_cpc?: number
        
        /** click-through rate as a percentage
calculated by dividing the number of clicks by the number of impressions and multiplying the result by 100 */
        ctr?: number
        
        /** total cost of an ad, USD
the cost of using the specified keyword and match type during the last month */
        total_cost?: number
        
        /** average bid of the keyword */
        average_bid?: number

    [key: string]: any;

    }

export class KeywordKpiInfo  implements IKeywordKpiInfo {
    
    /** represents the position of the relevant ad in SERP
can take the following values:
FirstPage1: The first ad to appear on the right side of the first search results page
FirstPage2: The second ad to appear on the right side of the first search results page
FirstPage3: The third ad to appear on the right side of the first search results page
FirstPage4: The fourth ad to appear on the right side of the first search results page
FirstPage5: The fifth ad to appear on the right side of the first search results page
FirstPage6: The sixth ad to appear on the right side of the first search results page
FirstPage7: The seventh ad to appear on the right side of the first search results page
FirstPage8: The eighth ad to appear on the right side of the first search results page
FirstPage9: The ninth ad to appear on the right side of the first search results page
FirstPage10: The tenth ad to appear on the right side of the first search results page
MainLine1: The first ad to appear at the top of the search results page
MainLine2: The second ad to appear at the top of the search results page
MainLine3: The third ad to appear at the top of the search results page
MainLine4: The fourth ad to appear at the top of the search results page */

    ad_position?: string;
    
    /** ad clicks
the number of clicks that the keyword and match type generated during the last month */

    clicks?: number;
    
    /** ad impressions
the number of impressions that the keyword and match type generated during the last month */

    impressions?: number;
    
    /** average cost per click, USD
calculated by dividing the cost of all clicks by the number of clicks */

    average_cpc?: number;
    
    /** click-through rate as a percentage
calculated by dividing the number of clicks by the number of impressions and multiplying the result by 100 */

    ctr?: number;
    
    /** total cost of an ad, USD
the cost of using the specified keyword and match type during the last month */

    total_cost?: number;
    
    /** average bid of the keyword */

    average_bid?: number;

    [key: string]: any;


    constructor(data?: IKeywordKpiInfo) {

    if (data) {
        for (var property in data) {
            if (data.hasOwnProperty(property))
                (<any>this)[property] = (<any>data)[property];
        }
    }

    }

    init(data?: any) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    this[property] = data[property];
            }
            this.ad_position = data["ad_position"];
            this.clicks = data["clicks"];
            this.impressions = data["impressions"];
            this.average_cpc = data["average_cpc"];
            this.ctr = data["ctr"];
            this.total_cost = data["total_cost"];
            this.average_bid = data["average_bid"];
        }
    }

    static fromJS(data: any): KeywordKpiInfo {
        data = typeof data === 'object' ? data : {};


        let result = new KeywordKpiInfo();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};

        
        
        data["ad_position"] = this.ad_position;
        data["clicks"] = this.clicks;
        data["impressions"] = this.impressions;
        data["average_cpc"] = this.average_cpc;
        data["ctr"] = this.ctr;
        data["total_cost"] = this.total_cost;
        data["average_bid"] = this.average_bid;
        return data;
    }
}