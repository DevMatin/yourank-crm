import { render, screen } from '@testing-library/react';
import { DataDebugPanel } from '@/components/keywords/data-debug-panel';
import { OverviewBasicsCard } from '@/components/keywords/overview-basics-card';
import { TrendChart } from '@/components/keywords/trend-chart';
import { DemographicsChart } from '@/components/keywords/demographics-chart';
import { RelatedKeywordsTable } from '@/components/keywords/related-keywords-table';
import { mockOverviewData } from '../mocks/dataforseo-responses';

// Mock Next.js environment
const originalEnv = process.env.NODE_ENV;

describe('Overview Components', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe('DataDebugPanel', () => {
    test('should render in development mode', () => {
      render(<DataDebugPanel data={mockOverviewData} />);
      
      expect(screen.getByText('Debug Panel')).toBeInTheDocument();
      expect(screen.getByText('Development Only')).toBeInTheDocument();
    });

    test('should not render in production mode', () => {
      process.env.NODE_ENV = 'production';
      const { container } = render(<DataDebugPanel data={mockOverviewData} />);
      
      expect(container.firstChild).toBeNull();
    });

    test('should show validation summary', () => {
      render(<DataDebugPanel data={mockOverviewData} />);
      
      expect(screen.getByText('Validation Summary')).toBeInTheDocument();
      expect(screen.getByText('Errors:')).toBeInTheDocument();
      expect(screen.getByText('Warnings:')).toBeInTheDocument();
    });

    test('should handle loading state', () => {
      render(<DataDebugPanel data={null} loading={true} />);
      
      expect(screen.getByText('Debug Panel - Loading...')).toBeInTheDocument();
    });

    test('should handle no data state', () => {
      render(<DataDebugPanel data={null} loading={false} />);
      
      expect(screen.getByText('Debug Panel - No data available')).toBeInTheDocument();
    });
  });

  describe('OverviewBasicsCard', () => {
    const mockBasicsData = {
      keyword: 'test keyword',
      searchVolume: 12000,
      cpc: 1.50,
      difficulty: 65.5,
      trend: 15.5
    };

    test('should render with complete data', () => {
      render(<OverviewBasicsCard data={mockBasicsData} />);
      
      expect(screen.getByText('test keyword')).toBeInTheDocument();
      expect(screen.getByText('12.0K')).toBeInTheDocument(); // Formatted search volume
      expect(screen.getByText('$1.50')).toBeInTheDocument(); // Formatted CPC
      expect(screen.getByText('66%')).toBeInTheDocument(); // Formatted difficulty
      expect(screen.getByText('+15.5%')).toBeInTheDocument(); // Formatted trend
    });

    test('should show missing data indicators', () => {
      const incompleteData = {
        keyword: 'test keyword',
        searchVolume: null,
        cpc: undefined,
        difficulty: null,
        trend: undefined
      };

      render(<OverviewBasicsCard data={incompleteData} />);
      
      expect(screen.getAllByText('N/A')).toHaveLength(4);
      // Should show warning icons for missing data
      expect(screen.getAllByRole('img', { hidden: true })).toHaveLength(4); // AlertTriangle icons
    });

    test('should handle loading state', () => {
      render(<OverviewBasicsCard data={null} loading={true} />);
      
      expect(screen.getByText('Keyword Basics')).toBeInTheDocument();
      // Should show skeleton loaders
      expect(screen.getAllByRole('generic')).toHaveLength(4); // Skeleton divs
    });
  });

  describe('TrendChart', () => {
    const mockTrendData = [
      { month: 'Jan', volume: 85, trend: 85 },
      { month: 'Feb', volume: 92, trend: 92 },
      { month: 'Mär', volume: 78, trend: 78 }
    ];

    test('should render with data', () => {
      render(<TrendChart data={mockTrendData} keyword="test keyword" />);
      
      expect(screen.getByText('Search Volume Trend')).toBeInTheDocument();
      expect(screen.getByText('Trend für "test keyword" über die letzten 12 Monate')).toBeInTheDocument();
    });

    test('should show no data message when empty', () => {
      render(<TrendChart data={[]} keyword="test keyword" />);
      
      expect(screen.getByText('No trend data available')).toBeInTheDocument();
      expect(screen.getByText('Trend data could not be loaded')).toBeInTheDocument();
    });

    test('should show loading state', () => {
      render(<TrendChart data={null} loading={true} />);
      
      expect(screen.getByText('Loading trend data...')).toBeInTheDocument();
    });
  });

  describe('DemographicsChart', () => {
    const mockDemographicsData = [
      { age_group: '18-24', percentage: 11 },
      { age_group: '25-34', percentage: 33 },
      { age_group: '35-44', percentage: 50 }
    ];

    test('should render with data', () => {
      render(<DemographicsChart data={mockDemographicsData} keyword="test keyword" type="age" />);
      
      expect(screen.getByText('Age Distribution')).toBeInTheDocument();
      expect(screen.getByText('Altersverteilung der Nutzer für "test keyword"')).toBeInTheDocument();
    });

    test('should show no data message when empty', () => {
      render(<DemographicsChart data={[]} keyword="test keyword" />);
      
      expect(screen.getByText('No demographics data available')).toBeInTheDocument();
      expect(screen.getByText('Demographics data could not be loaded')).toBeInTheDocument();
    });

    test('should show loading state', () => {
      render(<DemographicsChart data={null} loading={true} />);
      
      expect(screen.getByText('Loading demographics...')).toBeInTheDocument();
    });
  });

  describe('RelatedKeywordsTable', () => {
    const mockRelatedData = [
      {
        keyword: 'test keyword variations',
        search_volume: 8500,
        competition: 0.5,
        cpc: 1.25,
        trend: 8.5,
        related_keywords: ['related 1', 'related 2']
      },
      {
        keyword: 'test keyword alternatives',
        search_volume: 6200,
        competition: 0.2,
        cpc: 0.95,
        trend: 12.3,
        related_keywords: ['related 3', 'related 4']
      }
    ];

    test('should render with data', () => {
      render(<RelatedKeywordsTable data={mockRelatedData} />);
      
      expect(screen.getByText('test keyword variations')).toBeInTheDocument();
      expect(screen.getByText('test keyword alternatives')).toBeInTheDocument();
      expect(screen.getByText('8.5K')).toBeInTheDocument(); // Formatted search volume
      expect(screen.getByText('6.2K')).toBeInTheDocument(); // Formatted search volume
    });

    test('should show no data message when empty', () => {
      render(<RelatedKeywordsTable data={[]} />);
      
      expect(screen.getByText('Keine verwandten Keywords gefunden')).toBeInTheDocument();
      expect(screen.getByText('Related Keywords Daten konnten nicht geladen werden')).toBeInTheDocument();
    });
  });
});
