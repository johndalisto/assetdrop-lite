import React, { useState } from 'react';

interface EmailNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (emailData: EmailData) => void;
  recipients: string[];
}

interface EmailData {
  to: string[];
  subject: string;
  message: string;
  type: 'status_update' | 'general' | 'reminder';
}

export const EmailNotification: React.FC<EmailNotificationProps> = ({
  isOpen,
  onClose,
  onSubmit,
  recipients
}) => {
  const [emailData, setEmailData] = useState<EmailData>({
    to: [],
    subject: '',
    message: '',
    type: 'general'
  });

  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...emailData,
      to: selectedRecipients
    });
    onClose();
  };

  const toggleRecipient = (email: string) => {
    setSelectedRecipients(prev =>
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const selectAllRecipients = () => {
    setSelectedRecipients(recipients);
  };

  const deselectAllRecipients = () => {
    setSelectedRecipients([]);
  };

  const getTemplateMessage = (type: string) => {
    switch (type) {
      case 'status_update':
        return 'Your application status has been updated. Please check your dashboard for details.';
      case 'reminder':
        return 'This is a friendly reminder about your pending application.';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Send Email Notification</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Email Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Type
            </label>
            <select
              value={emailData.type}
              onChange={(e) => {
                const type = e.target.value as EmailData['type'];
                setEmailData(prev => ({
                  ...prev,
                  type,
                  message: getTemplateMessage(type)
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="general">General Message</option>
              <option value="status_update">Status Update</option>
              <option value="reminder">Reminder</option>
            </select>
          </div>

          {/* Recipients */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Recipients ({selectedRecipients.length} selected)
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={selectAllRecipients}
                  className="text-xs text-primary-600 hover:text-primary-800"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={deselectAllRecipients}
                  className="text-xs text-gray-600 hover:text-gray-800"
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {recipients.map((email) => (
                <label key={email} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedRecipients.includes(email)}
                    onChange={() => toggleRecipient(email)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3"
                  />
                  <span className="text-sm text-gray-700">{email}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter email subject..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={emailData.message}
              onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Enter your message..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Preview</h4>
            <div className="text-sm text-gray-600">
              <p><strong>To:</strong> {selectedRecipients.join(', ')}</p>
              <p><strong>Subject:</strong> {emailData.subject || 'No subject'}</p>
              <p><strong>Message:</strong></p>
              <div className="mt-2 p-3 bg-white rounded border text-gray-800 whitespace-pre-wrap">
                {emailData.message || 'No message'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedRecipients.length === 0 || !emailData.subject || !emailData.message}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Send Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
