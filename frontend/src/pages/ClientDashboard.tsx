import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio: string;
  role: string;
  status: string;
  createdAt: string;
}

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('https://deeper-functioning-seats-passage.trycloudflare.com/api/submissions');
      if (response.ok) {
        const data = await response.json();
        // Filter to show only user's own submissions
        const userSubmissions = data.submissions.filter((submission: Submission) => 
          submission.email === user?.email
        );
        setSubmissions(userSubmissions);
      } else {
        console.error('Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'musician': return 'fas fa-music';
      case 'speaker': return 'fas fa-microphone';
      case 'film-presenter': return 'fas fa-film';
      default: return 'fas fa-user';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted': return 'fas fa-clock';
      case 'Approved': return 'fas fa-check-circle';
      case 'Rejected': return 'fas fa-times-circle';
      default: return 'fas fa-question-circle';
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <i className="fas fa-user-circle mr-3"></i>
                Welcome back, {user?.name}!
              </h1>
              <p className="text-xl text-blue-100">
                Track your submissions and stay updated on your applications
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{submissions.length}</div>
              <div className="text-blue-100">Total Submissions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <i className="fas fa-clock text-yellow-600 text-xl"></i>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {submissions.filter(s => s.status === 'Submitted').length}
              </div>
              <div className="text-gray-600">Under Review</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {submissions.filter(s => s.status === 'Approved').length}
              </div>
              <div className="text-gray-600">Approved</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <i className="fas fa-chart-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round((submissions.filter(s => s.status === 'Approved').length / Math.max(submissions.length, 1)) * 100)}%
              </div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submissions List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h2 className="text-2xl font-semibold text-white">My Submissions</h2>
              <p className="text-blue-100">Track the status of your applications</p>
            </div>
            
            <div className="p-6">
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-file-alt text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No submissions yet</h3>
                  <p className="text-gray-500 mb-6">Get started by creating your first submission</p>
                  <Link 
                    to="/submit" 
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Create Submission
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <i className={`${getRoleIcon(submission.role)} text-blue-600 text-lg`}></i>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 mr-3">
                                {submission.name}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(submission.status)}`}>
                                <i className={`${getStatusIcon(submission.status)} mr-1`}></i>
                                {submission.status}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2 capitalize">
                              {submission.role.replace('-', ' ')} Application
                            </p>
                            <p className="text-gray-500 text-sm mb-3">
                              {submission.bio.substring(0, 120)}...
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <i className="fas fa-calendar mr-1"></i>
                              Submitted on {formatDate(submission.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 p-2" title="View Details">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 p-2" title="Edit">
                            <i className="fas fa-edit"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                to="/submit" 
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>
                New Submission
              </Link>
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <i className="fas fa-download mr-2"></i>
                Download Portfolio
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <i className="fas fa-cog mr-2"></i>
                Account Settings
              </button>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Application Success</span>
                  <span>{Math.round((submissions.filter(s => s.status === 'Approved').length / Math.max(submissions.length, 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round((submissions.filter(s => s.status === 'Approved').length / Math.max(submissions.length, 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Response Rate</span>
                  <span>{Math.round(((submissions.filter(s => s.status === 'Approved').length + submissions.filter(s => s.status === 'Rejected').length) / Math.max(submissions.length, 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round(((submissions.filter(s => s.status === 'Approved').length + submissions.filter(s => s.status === 'Rejected').length) / Math.max(submissions.length, 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips & Resources */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
              Tips for Success
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                <span>Keep your bio concise and engaging</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                <span>Upload high-quality media files</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                <span>Follow up on pending applications</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
