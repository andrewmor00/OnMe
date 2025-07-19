// Analytics Export Utility
import { analyticsStorage } from './localStorage.js';

// Export analytics data as JSON
export const exportAnalyticsAsJSON = (period = 'all') => {
  const data = analyticsStorage.getAnalyticsData();
  
  if (period === 'all') {
    return {
      exportDate: new Date().toISOString(),
      analytics: data
    };
  }
  
  if (period === 'week') {
    return {
      exportDate: new Date().toISOString(),
      period: 'week',
      analytics: data.week
    };
  }
  
  if (period === 'month') {
    return {
      exportDate: new Date().toISOString(),
      period: 'month',
      analytics: data.month
    };
  }
  
  if (period === 'year') {
    return {
      exportDate: new Date().toISOString(),
      period: 'year',
      analytics: data.year
    };
  }
  
  return null;
};

// Export analytics data as formatted JSON string
export const exportAnalyticsAsJSONString = (period = 'all') => {
  const data = exportAnalyticsAsJSON(period);
  return JSON.stringify(data, null, 2);
};

// Download analytics data as JSON file
export const downloadAnalyticsJSON = (period = 'all') => {
  const data = exportAnalyticsAsJSONString(period);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analytics_${period}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Get analytics summary for specific period
export const getAnalyticsSummary = (period) => {
  return analyticsStorage.getSummaryForPeriod(period);
};

// Get platform breakdown for specific period
export const getPlatformBreakdown = (period) => {
  return analyticsStorage.getPlatformBreakdownForPeriod(period);
};

// Get top posts for specific period
export const getTopPosts = (period) => {
  return analyticsStorage.getTopPostsForPeriod(period);
};

// Get audience demographics for specific period
export const getAudienceDemographics = (period) => {
  return analyticsStorage.getAudienceDemographicsForPeriod(period);
};

// Get time series data for specific period
export const getTimeSeriesData = (period) => {
  return analyticsStorage.getTimeSeriesDataForPeriod(period);
};

// Get growth metrics (year only)
export const getGrowthMetrics = () => {
  return analyticsStorage.getGrowthMetrics();
}; 