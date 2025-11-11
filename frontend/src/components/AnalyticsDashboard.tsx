import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  totalSubmissions: number;
  submissionsByRole: { [key: string]: number };
  submissionsByStatus: { [key: string]: number };
  submissionsByMonth: { [key: string]: number };
  averageProcessingTime: number;
  topPerformers: Array<{
    name: string;
    role: string;
    submissions: number;
  }>;
}

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Simulate API call with realistic data
      const mockData: AnalyticsData = {
        totalSubmissions: Math.floor(Math.random() * 500) + 100,
        submissionsByRole: {
          'musician': Math.floor(Math.random() * 200) + 50,
          'speaker': Math.floor(Math.random() * 150) + 30,
          'film-presenter': Math.floor(Math.random() * 100) + 20
        },
        submissionsByStatus: {
          'Submitted': Math.floor(Math.random() * 100) + 20,
          'Approved': Math.floor(Math.random() * 80) + 15,
          'Rejected': Math.floor(Math.random() * 30) + 5
        },
        submissionsByMonth: generateMonthlyData(),
        averageProcessingTime: Math.floor(Math.random() * 5) + 2,
        topPerformers: [
          { name: 'John Smith', role: 'Musician', submissions: 5 },
          { name: 'Sarah Johnson', role: 'Speaker', submissions: 4 },
          { name: 'Mike Davis', role: 'Film Presenter', submissions: 3 }
        ]
      };
      
      setAnalytics(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data: { [key: string]: number } = {};
    months.forEach(month => {
      data[month] = Math.floor(Math.random() * 50) + 10;
    });
    return data;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-2">Comprehensive insights into your platform performance</p>
        </div>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{analytics.totalSubmissions}</p>
              <p className="text-blue-100">Total Submissions</p>
              <p className="text-blue-200 text-sm">+12% from last period</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
              <i className="fas fa-chart-line text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{analytics.submissionsByStatus.Approved}</p>
              <p className="text-green-100">Approved</p>
              <p className="text-green-200 text-sm">{Math.round((analytics.submissionsByStatus.Approved / analytics.totalSubmissions) * 100)}% approval rate</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
              <i className="fas fa-check-circle text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{analytics.averageProcessingTime}</p>
              <p className="text-purple-100">Avg. Processing</p>
              <p className="text-purple-200 text-sm">days to review</p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
              <i className="fas fa-clock text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{Object.keys(analytics.submissionsByRole).length}</p>
              <p className="text-orange-100">Role Types</p>
              <p className="text-orange-200 text-sm">Active categories</p>
            </div>
            <div className="bg-orange-400 bg-opacity-30 p-3 rounded-full">
              <i className="fas fa-users text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions by Role */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Submissions by Role</h3>
          <div className="space-y-4">
            {Object.entries(analytics.submissionsByRole).map(([role, count]) => {
              const percentage = (count / analytics.totalSubmissions) * 100;
              return (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {role.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-4">
            {Object.entries(analytics.submissionsByStatus).map(([status, count]) => {
              const percentage = (count / analytics.totalSubmissions) * 100;
              const color = status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'yellow';
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-${color}-500`}></div>
                    <span className="text-sm font-medium text-gray-700">{status}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Performers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Submissions</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topPerformers.map((performer, index) => (
                <tr key={performer.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{performer.name}</td>
                  <td className="py-3 px-4">
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                      {performer.role.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{performer.submissions}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${(performer.submissions / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {Math.round((performer.submissions / 5) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
