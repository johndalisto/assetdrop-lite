import React, { useState } from 'react';

interface BulkActionsProps {
  selectedCount: number;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onBulkExport: () => void;
  onBulkDelete: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  totalCount: number;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onBulkApprove,
  onBulkReject,
  onBulkExport,
  onBulkDelete,
  onSelectAll,
  onDeselectAll,
  totalCount
}) => {
  const [showActions, setShowActions] = useState(false);

  if (selectedCount === 0) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={onSelectAll}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
          >
            <i className="fas fa-check-square mr-2"></i>
            Select All ({totalCount})
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {totalCount} total submissions
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-primary-50 border-b border-primary-200">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-primary-800">
          {selectedCount} selected
        </span>
        <button
          onClick={onDeselectAll}
          className="text-sm text-primary-600 hover:text-primary-800"
        >
          <i className="fas fa-times mr-1"></i>
          Deselect All
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowActions(!showActions)}
          className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 flex items-center"
        >
          <i className="fas fa-cog mr-1"></i>
          Actions
        </button>
        
        {showActions && (
          <div className="absolute right-4 top-16 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-48">
            <button
              onClick={() => {
                onBulkApprove();
                setShowActions(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center"
            >
              <i className="fas fa-check mr-3 text-green-500"></i>
              Approve Selected
            </button>
            <button
              onClick={() => {
                onBulkReject();
                setShowActions(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center"
            >
              <i className="fas fa-times mr-3 text-red-500"></i>
              Reject Selected
            </button>
            <button
              onClick={() => {
                onBulkExport();
                setShowActions(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center"
            >
              <i className="fas fa-download mr-3 text-blue-500"></i>
              Export Selected
            </button>
            <hr className="my-1" />
            <button
              onClick={() => {
                onBulkDelete();
                setShowActions(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center"
            >
              <i className="fas fa-trash mr-3 text-red-500"></i>
              Delete Selected
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
