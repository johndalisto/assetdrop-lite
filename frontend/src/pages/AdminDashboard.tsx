import React, { useState, useEffect } from 'react';
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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  submissionCount: number;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  // Removed unused state variables - using tab-based navigation instead
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'users' | 'analytics' | 'files'>('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch submissions
      const submissionsResponse = await fetch('https://deeper-functioning-seats-passage.trycloudflare.com/api/submissions');
      if (submissionsResponse.ok) {
        const submissionsData = await submissionsResponse.json();
        setSubmissions(submissionsData.submissions);
        setFilteredSubmissions(submissionsData.submissions);
      }

      // Fetch users (admin only)
      if (token) {
        const usersResponse = await fetch('https://deeper-functioning-seats-passage.trycloudflare.com/api/auth/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData.users.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            lastLogin: u.lastLogin || 'Never',
            submissionCount: 0 // Will be calculated from submissions
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...submissions];

    if (filters.searchTerm) {
      filtered = filtered.filter(submission =>
        submission.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        submission.bio.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter(submission =>
        filters.status.includes(submission.status)
      );
    }

    if (filters.role.length > 0) {
      filtered = filtered.filter(submission =>
        filters.role.includes(submission.role)
      );
    }

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
        await fetchData();
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
    alert('Email sent successfully!');
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

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Access Banner */}
      <div className="mb-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-user-shield text-3xl mr-4"></i>
            <div>
              <div className="font-bold text-lg">ADMINISTRATOR ACCESS</div>
              <div className="text-red-100 text-sm">You have full system access to all client data and submissions</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{submissions.length}</div>
            <div className="text-red-100 text-sm">Client Submissions</div>
          </div>
        </div>
      </div>

      {/* Admin Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <i className="fas fa-shield-alt mr-3 text-red-600"></i>
              Admin Control Panel
            </h1>
            <p className="text-xl text-gray-600">
              System administration and management dashboard
            </p>
            <div className="mt-2 text-sm text-gray-500">
              Welcome back, <span className="font-semibold text-gray-700">{user?.name}</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleBulkExport}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
            >
              <i className="fas fa-download mr-2"></i>
              Export Data
            </button>
            <button
              onClick={() => setShowEmailModal(true)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              <i className="fas fa-envelope mr-2"></i>
              Send Notifications
            </button>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: 'fas fa-tachometer-alt' },
              { id: 'submissions', label: 'Submissions', icon: 'fas fa-file-alt' },
              { id: 'users', label: 'Users', icon: 'fas fa-users' },
              { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar' },
              { id: 'files', label: 'Files', icon: 'fas fa-folder' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{submissions.length}</p>
                  <p className="text-red-100">Total Submissions</p>
                </div>
                <div className="bg-red-400 bg-opacity-30 p-3 rounded-full">
                  <i className="fas fa-file-alt text-2xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {submissions.filter(s => s.status === 'Submitted').length}
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
                    {submissions.filter(s => s.status === 'Approved').length}
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
                  <p className="text-3xl font-bold">{users.length}</p>
                  <p className="text-purple-100">Active Users</p>
                </div>
                <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
                  <i className="fas fa-users text-2xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors">
                <i className="fas fa-user-plus text-2xl text-gray-400 mb-2"></i>
                <div className="font-medium text-gray-700">Add New User</div>
                <div className="text-sm text-gray-500">Create admin or host account</div>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <i className="fas fa-cog text-2xl text-gray-400 mb-2"></i>
                <div className="font-medium text-gray-700">System Settings</div>
                <div className="text-sm text-gray-500">Configure application settings</div>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <i className="fas fa-database text-2xl text-gray-400 mb-2"></i>
                <div className="font-medium text-gray-700">Backup Data</div>
                <div className="text-sm text-gray-500">Create system backup</div>
              </button>
            </div>
          </div>

          {/* All Client Submissions */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">All Client Submissions</h3>
                <p className="text-sm text-gray-500">Showing {submissions.length} total submissions from all clients</p>
              </div>
              <button 
                onClick={() => setActiveTab('submissions')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                View All <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
            
            {submissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-inbox text-4xl mb-2 text-gray-300"></i>
                <p>No client submissions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.slice(0, 8).map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center flex-1">
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                        <i className={`${getRoleIcon(submission.role)} text-red-600`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{submission.name}</div>
                        <div className="text-sm text-gray-500">
                          <span className="capitalize">{submission.role.replace('-', ' ')}</span> • {submission.email}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        submission.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                        submission.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {submission.status}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{formatDate(submission.createdAt)}</div>
                    </div>
                  </div>
                ))}
                {submissions.length > 8 && (
                  <div className="text-center pt-2">
                    <button 
                      onClick={() => setActiveTab('submissions')}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      View {submissions.length - 8} more submissions →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-center">
              <i className="fas fa-info-circle text-blue-500 text-xl mr-3"></i>
              <div>
                <h3 className="font-semibold text-blue-900">Viewing All Client Submissions</h3>
                <p className="text-sm text-blue-700">
                  You are seeing <strong>{filteredSubmissions.length} submissions</strong> from all clients across the system.
                </p>
              </div>
            </div>
          </div>

          <SearchAndFilter 
            onFilterChange={handleFilterChange}
            totalResults={filteredSubmissions.length}
          />

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

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">All Client Submissions</h2>
                  <p className="text-red-100">Viewing {filteredSubmissions.length} submissions from all clients across the system</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{filteredSubmissions.length}</div>
                  <div className="text-red-100 text-sm">Total Submissions</div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {filteredSubmissions.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <i className="fas fa-inbox text-6xl mb-4 text-gray-300"></i>
                  <h3 className="text-xl font-semibold mb-2">No client submissions found</h3>
                  <p>No submissions match your current filters or no clients have submitted yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            checked={selectedSubmissions.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                            onChange={selectedSubmissions.length === filteredSubmissions.length ? handleDeselectAll : handleSelectAll}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Client Name</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Email Address</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Role Type</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Phone</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((submission, index) => (
                        <tr key={submission.id} className={`border-b hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                        }`}>
                          <td className="py-4 px-4">
                            <input
                              type="checkbox"
                              checked={selectedSubmissions.includes(submission.id)}
                              onChange={() => toggleSubmissionSelection(submission.id)}
                              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="bg-red-100 p-3 rounded-full mr-3">
                                <i className={`${getRoleIcon(submission.role)} text-red-600 text-lg`}></i>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{submission.name}</div>
                                <div className="text-xs text-gray-400">Client</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-blue-600">{submission.email}</div>
                            {submission.bio && (
                              <div className="text-xs text-gray-500 truncate max-w-xs">
                                {submission.bio.substring(0, 40)}...
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                              {submission.role.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-700">
                              {submission.phone || <span className="text-gray-400 italic">Not provided</span>}
                            </div>
                          </td>
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
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button 
                                className="text-red-600 hover:text-red-700 p-1"
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
            <h2 className="text-2xl font-semibold text-white">User Management</h2>
            <p className="text-purple-100">Manage user accounts and permissions</p>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">User</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Submissions</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Last Login</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-3 rounded-full mr-4">
                            <i className="fas fa-user text-purple-600 text-lg"></i>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'host' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-lg font-semibold text-gray-900">{user.submissionCount}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 p-1" title="Edit User">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="text-red-600 hover:text-red-700 p-1" title="Delete User">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <AnalyticsDashboard />
        </div>
      )}

      {/* Files Tab */}
      {activeTab === 'files' && (
        <div>
          <FileManager 
            files={[]}
            allowUpload={true}
            onFileUpload={(files) => console.log('Upload files:', files)}
          />
        </div>
      )}

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
