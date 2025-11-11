import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SearchAndFilter } from '../components/SearchAndFilter';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { FileManager } from '../components/FileManager';
import { BulkActions } from '../components/BulkActions';
import { EmailNotification } from '../components/EmailNotification';

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

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('https://deeper-functioning-seats-passage.trycloudflare.com/api/submissions');
      if (response.ok) {
        const data = await response.json();
        // Filter submissions based on user role
        if (user?.role === 'admin') {
          // Admins see all submissions
          setSubmissions(data.submissions);
          setFilteredSubmissions(data.submissions);
        } else {
          // Regular users see only their own submissions
          const userSubmissions = data.submissions.filter((submission: Submission) => 
            submission.email === user?.email
          );
          setSubmissions(userSubmissions);
          setFilteredSubmissions(userSubmissions);
        }
      } else {
        console.error('Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...submissions];

    // Apply search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(submission =>
        submission.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        submission.bio.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(submission =>
        filters.status.includes(submission.status)
      );
    }

    // Apply role filter
    if (filters.role.length > 0) {
      filtered = filtered.filter(submission =>
        filters.role.includes(submission.role)
      );
    }

    // Apply date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter(submission =>
        new Date(submission.createdAt) >= new Date(filters.dateRange.start)
      );
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(submission =>
        new Date(submission.createdAt) <= new Date(filters.dateRange.end)
      );
    }

    setFilteredSubmissions(filtered);
  };

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

  const updateSubmissionStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const response = await fetch(`https://deeper-functioning-seats-passage.trycloudflare.com/api/submissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Refresh submissions
        await fetchSubmissions();
      } else {
        console.error('Failed to update submission status');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleBulkApprove = () => {
    selectedSubmissions.forEach(id => {
      updateSubmissionStatus(id, 'Approved');
    });
    setSelectedSubmissions([]);
  };

  const handleBulkReject = () => {
    selectedSubmissions.forEach(id => {
      updateSubmissionStatus(id, 'Rejected');
    });
    setSelectedSubmissions([]);
  };

  const handleBulkExport = async () => {
    try {
      const response = await fetch('https://deeper-functioning-seats-passage.trycloudflare.com/api/submissions/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `submissions-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to export submissions');
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedSubmissions.length} submissions?`)) {
      // In a real app, you'd call an API to delete these
      console.log('Deleting submissions:', selectedSubmissions);
      setSelectedSubmissions([]);
    }
  };

  const handleSelectAll = () => {
    setSelectedSubmissions(filteredSubmissions.map(sub => sub.id));
  };

  const handleDeselectAll = () => {
    setSelectedSubmissions([]);
  };

  const toggleSubmissionSelection = (id: string) => {
    setSelectedSubmissions(prev =>
      prev.includes(id)
        ? prev.filter(subId => subId !== id)
        : [...prev, id]
    );
  };

  const handleEmailSubmit = (emailData: any) => {
    console.log('Sending email:', emailData);
    // In a real app, you'd call an API to send emails
    alert('Email sent successfully!');
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              <i className="fas fa-chart-line mr-3 text-primary-600"></i>
              {user?.role === 'admin' ? 'Admin Dashboard' : 'My Submissions'}
            </h1>
            <p className="text-xl text-gray-600">
              {user?.role === 'admin' 
                ? 'Monitor all submissions and track application status' 
                : 'Track your application status and submissions'
              }
            </p>
          </div>
          {user?.role === 'admin' && (
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showAnalytics 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="fas fa-chart-bar mr-2"></i>
                Analytics
              </button>
              <button
                onClick={() => setShowFileManager(!showFileManager)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showFileManager 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="fas fa-folder mr-2"></i>
                Files
              </button>
              <button
                onClick={handleBulkExport}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
              >
                <i className="fas fa-download mr-2"></i>
                Export All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{filteredSubmissions.length}</p>
              <p className="text-blue-100">
                {user?.role === 'admin' ? 'Total Submissions' : 'My Submissions'}
              </p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
              <i className="fas fa-file-alt text-2xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">
                {filteredSubmissions.filter(s => s.status === 'Submitted').length}
              </p>
              <p className="text-yellow-100">Pending Review</p>
            </div>
            <div className="bg-yellow-400 bg-opacity-30 p-3 rounded-full">
              <i className="fas fa-clock text-2xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">
                {filteredSubmissions.filter(s => s.status === 'Approved').length}
              </p>
              <p className="text-green-100">Approved</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
              <i className="fas fa-check-circle text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">
                {user?.role === 'admin' 
                  ? new Set(filteredSubmissions.map(s => s.role)).size
                  : filteredSubmissions.filter(s => s.status === 'Rejected').length
                }
              </p>
              <p className="text-purple-100">
                {user?.role === 'admin' ? 'Role Types' : 'Rejected'}
              </p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
              <i className={`fas ${user?.role === 'admin' ? 'fa-users' : 'fa-times-circle'} text-2xl`}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && user?.role === 'admin' && (
        <div className="mb-8">
          <AnalyticsDashboard />
        </div>
      )}

      {/* File Manager */}
      {showFileManager && user?.role === 'admin' && (
        <div className="mb-8">
          <FileManager 
            files={[]} // This would be populated from actual file data
            allowUpload={true}
            onFileUpload={(files) => console.log('Upload files:', files)}
          />
        </div>
      )}

      {/* Search and Filter */}
      <SearchAndFilter 
        onFilterChange={handleFilterChange}
        totalResults={filteredSubmissions.length}
      />

      {/* Bulk Actions */}
      {user?.role === 'admin' && (
        <BulkActions
          selectedCount={selectedSubmissions.length}
          onBulkApprove={handleBulkApprove}
          onBulkReject={handleBulkReject}
          onBulkExport={handleBulkExport}
          onBulkDelete={handleBulkDelete}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          totalCount={filteredSubmissions.length}
        />
      )}

      {/* Enhanced Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6">
          <h2 className="text-2xl font-semibold text-white">
            {user?.role === 'admin' ? 'All Submissions' : 'My Submissions'}
          </h2>
          <p className="text-primary-100">
            {user?.role === 'admin' 
              ? 'Manage and review all applications' 
              : 'Track your application status'
            }
          </p>
        </div>
        
        <div className="p-6">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <i className="fas fa-inbox text-6xl mb-4 text-gray-300"></i>
              <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
              <p className="mb-4">Get started by creating your first submission</p>
              <Link to="/submit" className="btn-primary">
                <i className="fas fa-plus mr-2"></i>
                Create Submission
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    {user?.role === 'admin' && (
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedSubmissions.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                          onChange={selectedSubmissions.length === filteredSubmissions.length ? handleDeselectAll : handleSelectAll}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </th>
                    )}
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      {user?.role === 'admin' ? 'Applicant' : 'Name'}
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Role</th>
                    {user?.role === 'admin' && (
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Contact</th>
                    )}
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Submitted</th>
                    {user?.role === 'admin' && (
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission, index) => (
                    <tr key={submission.id} className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}>
                      {user?.role === 'admin' && (
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={selectedSubmissions.includes(submission.id)}
                            onChange={() => toggleSubmissionSelection(submission.id)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </td>
                      )}
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="bg-primary-100 p-3 rounded-full mr-4">
                            <i className={`${getRoleIcon(submission.role)} text-primary-600 text-lg`}></i>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{submission.name}</div>
                            {user?.role === 'admin' && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {submission.bio.substring(0, 60)}...
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                          {submission.role.replace('-', ' ')}
                        </span>
                      </td>
                      {user?.role === 'admin' && (
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div className="text-gray-900">{submission.email}</div>
                            {submission.phone && (
                              <div className="text-gray-500">{submission.phone}</div>
                            )}
                          </div>
                        </td>
                      )}
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          submission.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                          submission.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {formatDate(submission.createdAt)}
                      </td>
                      {user?.role === 'admin' && (
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button 
                              className="text-primary-600 hover:text-primary-700 p-1"
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              onClick={() => setShowEmailModal(true)}
                              className="text-blue-600 hover:text-blue-700 p-1"
                              title="Send Email"
                            >
                              <i className="fas fa-envelope"></i>
                            </button>
                            {submission.status !== 'Approved' && (
                              <button 
                                onClick={() => updateSubmissionStatus(submission.id, 'Approved')}
                                disabled={updating === submission.id}
                                className="text-green-600 hover:text-green-700 p-1 disabled:opacity-50"
                                title="Approve"
                              >
                                {updating === submission.id ? (
                                  <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                  <i className="fas fa-check"></i>
                                )}
                              </button>
                            )}
                            {submission.status !== 'Rejected' && (
                              <button 
                                onClick={() => updateSubmissionStatus(submission.id, 'Rejected')}
                                disabled={updating === submission.id}
                                className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50"
                                title="Reject"
                              >
                                {updating === submission.id ? (
                                  <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                  <i className="fas fa-times"></i>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Email Notification Modal */}
      <EmailNotification
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        recipients={filteredSubmissions.map(sub => sub.email)}
      />
    </div>
  );
};
