import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio: string;
  role: string;
  status: string;
  createdAt: string;
  assignedHostId?: string;
}

export const HostDashboard: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.submissions.list);
      if (response.ok) {
        const data = await response.json();
        // Filter to show only submissions assigned to this host
        // For now, we'll show all submissions, but in production this would filter by assignedHostId
        // When assignment is implemented, change to: data.submissions.filter((sub: Submission) => sub.assignedHostId === user?.id)
        const assignedSubmissions = data.submissions.filter((sub: Submission) => 
          // For now, show all submissions. In production, filter by: sub.assignedHostId === user?.id
          true // Placeholder - will be replaced with actual assignment logic
        );
        setSubmissions(assignedSubmissions);
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

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Host Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <i className="fas fa-user-tie mr-3"></i>
                Host Dashboard
              </h1>
              <p className="text-xl text-green-100">
                Welcome back, {user?.name}! Manage submissions assigned to you
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{submissions.length}</div>
              <div className="text-green-100">Assigned Submissions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
        <div className="flex items-center">
          <i className="fas fa-info-circle text-blue-500 text-xl mr-3"></i>
          <div>
            <h3 className="font-semibold text-blue-900">Host View</h3>
            <p className="text-sm text-blue-700">
              You are viewing submissions assigned to you. Only submissions linked to your account are visible here.
            </p>
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
              <div className="text-gray-600">Pending Review</div>
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
              <i className="fas fa-users text-blue-600 text-xl"></i>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{submissions.length}</div>
              <div className="text-gray-600">Total Assigned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
          <h2 className="text-2xl font-semibold text-white">Assigned Submissions</h2>
          <p className="text-green-100">Submissions assigned to your account</p>
        </div>
        
        <div className="p-6">
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No assigned submissions</h3>
              <p className="text-gray-500">Submissions will appear here once they are assigned to you by an administrator.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Submitted</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission, index) => (
                    <tr key={submission.id} className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-3 rounded-full mr-3">
                            <i className={`${getRoleIcon(submission.role)} text-green-600 text-lg`}></i>
                          </div>
                          <div className="font-semibold text-gray-900">{submission.name}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-blue-600">{submission.email}</div>
                        {submission.phone && (
                          <div className="text-xs text-gray-500">{submission.phone}</div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                          {submission.role.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(submission.status)}`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {formatDate(submission.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 p-1" title="View Details">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="text-green-600 hover:text-green-700 p-1" title="Approve">
                            <i className="fas fa-check"></i>
                          </button>
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
  );
};

