import React, { useState } from 'react';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
  status: 'uploaded' | 'processing' | 'ready';
}

interface FileManagerProps {
  files: FileItem[];
  onFileSelect?: (file: FileItem) => void;
  onFileDelete?: (fileId: string) => void;
  onFileDownload?: (fileId: string) => void;
  allowUpload?: boolean;
  onFileUpload?: (files: FileList) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  onFileSelect,
  onFileDelete,
  onFileDownload,
  allowUpload = false,
  onFileUpload
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return 'fas fa-image text-blue-500';
    if (type.startsWith('video/')) return 'fas fa-video text-purple-500';
    if (type.startsWith('audio/')) return 'fas fa-music text-green-500';
    if (type.includes('pdf')) return 'fas fa-file-pdf text-red-500';
    if (type.includes('word')) return 'fas fa-file-word text-blue-600';
    if (type.includes('excel')) return 'fas fa-file-excel text-green-600';
    return 'fas fa-file text-gray-500';
  };

  const handleFileSelect = (file: FileItem) => {
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleFileDelete = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFileDelete) {
      onFileDelete(fileId);
    }
  };

  const handleFileDownload = (file: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFileDownload) {
      onFileDownload(file.id);
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onFileUpload) {
      onFileUpload(e.target.files);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAll = () => {
    setSelectedFiles(files.map(f => f.id));
  };

  const deselectAll = () => {
    setSelectedFiles([]);
  };

  const openPreview = (file: FileItem) => {
    setPreviewFile(file);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-semibold text-white">File Manager</h3>
            <p className="text-primary-100 mt-1">
              {files.length} files • {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))} total
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {allowUpload && (
              <label className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 cursor-pointer transition-colors">
                <i className="fas fa-upload mr-2"></i>
                Upload Files
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
              </label>
            )}
            <div className="flex bg-white bg-opacity-20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white text-primary-600' : 'text-white'}`}
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white text-primary-600' : 'text-white'}`}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={selectedFiles.length === files.length ? deselectAll : selectAll}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              {selectedFiles.length === files.length ? 'Deselect All' : 'Select All'}
            </button>
            {selectedFiles.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedFiles.length} selected
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-sm text-gray-600 hover:text-gray-800">
              <i className="fas fa-sort mr-1"></i>
              Sort
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-800">
              <i className="fas fa-filter mr-1"></i>
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* File Grid/List */}
      <div className="p-6">
        {files.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No files yet</h3>
            <p className="text-gray-400">Upload some files to get started</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedFiles.includes(file.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
                onClick={() => handleFileSelect(file)}
              >
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => handleFileDownload(file, e)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <i className="fas fa-download text-sm"></i>
                    </button>
                    <button
                      onClick={(e) => handleFileDelete(file.id, e)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <i className={`${getFileIcon(file.type)} text-3xl`}></i>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm truncate" title={file.name}>
                    {file.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.size)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {file.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedFiles.includes(file.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
                onClick={() => handleFileSelect(file)}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3"
                />
                
                <div className="flex items-center flex-1 min-w-0">
                  <i className={`${getFileIcon(file.type)} text-2xl mr-4`}></i>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    file.status === 'ready' ? 'bg-green-100 text-green-800' :
                    file.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {file.status}
                  </span>
                  <button
                    onClick={(e) => handleFileDownload(file, e)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <i className="fas fa-download"></i>
                  </button>
                  <button
                    onClick={(e) => handleFileDelete(file.id, e)}
                    className="text-gray-400 hover:text-red-600 p-2"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-4xl w-full m-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{previewFile.name}</h3>
              <button
                onClick={closePreview}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-4">
              {previewFile.type.startsWith('image/') ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full max-h-96 mx-auto"
                />
              ) : previewFile.type.startsWith('video/') ? (
                <video
                  src={previewFile.url}
                  controls
                  className="max-w-full max-h-96 mx-auto"
                />
              ) : previewFile.type.startsWith('audio/') ? (
                <audio
                  src={previewFile.url}
                  controls
                  className="w-full"
                />
              ) : (
                <div className="text-center py-12">
                  <i className={`${getFileIcon(previewFile.type)} text-6xl text-gray-400 mb-4`}></i>
                  <p className="text-gray-500">Preview not available for this file type</p>
                  <button
                    onClick={(e) => handleFileDownload(previewFile, e)}
                    className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
