import React, { useState } from 'react';

interface FilterOptions {
  status: string[];
  role: string[];
  dateRange: {
    start: string;
    end: string;
  };
  searchTerm: string;
}

interface SearchAndFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  totalResults: number;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onFilterChange,
  totalResults
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    role: [],
    dateRange: { start: '', end: '' },
    searchTerm: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = ['Submitted', 'Approved', 'Rejected', 'Draft'];
  const roleOptions = ['musician', 'speaker', 'film-presenter'];

  const handleSearchChange = (searchTerm: string) => {
    const newFilters = { ...filters, searchTerm };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    const newFilters = { ...filters, status: newStatus };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRoleToggle = (role: string) => {
    const newRole = filters.role.includes(role)
      ? filters.role.filter(r => r !== role)
      : [...filters.role, role];
    const newFilters = { ...filters, role: newRole };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    const newFilters = {
      ...filters,
      dateRange: { ...filters.dateRange, [field]: value }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      status: [],
      role: [],
      dateRange: { start: '', end: '' },
      searchTerm: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.status.length > 0 || 
                          filters.role.length > 0 || 
                          filters.dateRange.start || 
                          filters.dateRange.end || 
                          filters.searchTerm;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            placeholder="Search submissions, names, emails..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <i className="fas fa-sliders-h mr-2"></i>
          Filters
        </button>
        <button
          onClick={clearAllFilters}
          disabled={!hasActiveFilters}
          className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-times mr-2"></i>
          Clear
        </button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{totalResults}</span> results
          {hasActiveFilters && (
            <span className="ml-2 text-primary-600">
              (filtered from total)
            </span>
          )}
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select className="text-sm border border-gray-300 rounded px-3 py-1">
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Name A-Z</option>
            <option>Name Z-A</option>
            <option>Status</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Status
              </label>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => handleStatusToggle(status)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3"
                    />
                    <span className="text-sm text-gray-700">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Role
              </label>
              <div className="space-y-2">
                {roleOptions.map((role) => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.role.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {role.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Date Range
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.status.map((status) => (
              <span
                key={status}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {status}
                <button
                  onClick={() => handleStatusToggle(status)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <i className="fas fa-times"></i>
                </button>
              </span>
            ))}
            {filters.role.map((role) => (
              <span
                key={role}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {role.replace('-', ' ')}
                <button
                  onClick={() => handleRoleToggle(role)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <i className="fas fa-times"></i>
                </button>
              </span>
            ))}
            {(filters.dateRange.start || filters.dateRange.end) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {filters.dateRange.start && filters.dateRange.end
                  ? `${filters.dateRange.start} - ${filters.dateRange.end}`
                  : filters.dateRange.start
                  ? `From ${filters.dateRange.start}`
                  : `Until ${filters.dateRange.end}`}
                <button
                  onClick={() => handleDateRangeChange('start', '')}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <i className="fas fa-times"></i>
                </button>
              </span>
            )}
            {filters.searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Search: "{filters.searchTerm}"
                <button
                  onClick={() => handleSearchChange('')}
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  <i className="fas fa-times"></i>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
