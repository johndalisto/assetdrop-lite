import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitterRole } from '../types';
import { API_ENDPOINTS } from '../config/api';

export const SubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<SubmitterRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    // Role-specific fields
    genre: '',
    instruments: '',
    musicLinks: '',
    topics: '',
    speakingExperience: '',
    presentationMaterials: '',
    filmTitle: '',
    filmGenre: '',
    screeningDetails: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      linkedin: '',
      website: '',
      youtube: '',
      tiktok: ''
    }
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social_')) {
      const socialField = name.replace('social_', '');
      setFormData({
        ...formData,
        socialMedia: {
          ...formData.socialMedia,
          [socialField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const formData = new FormData();
    
    fileArray.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(API_ENDPOINTS.files.uploadMultiple, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await response.json();
        setUploadedFiles(prev => [...prev, ...fileArray]);
        setSubmitMessage('Files uploaded successfully!');
      } else {
        setSubmitMessage('File upload failed. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Network error during file upload.');
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch(API_ENDPOINTS.submissions.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio || '',
          role: selectedRole,
          status: 'Draft',
          // Role-specific data
          ...(selectedRole === 'musician' && {
            genre: formData.genre,
            instruments: formData.instruments,
            musicLinks: formData.musicLinks || ''
          }),
          ...(selectedRole === 'speaker' && {
            topics: formData.topics,
            speakingExperience: formData.speakingExperience || '',
            presentationMaterials: formData.presentationMaterials || ''
          }),
          ...(selectedRole === 'film-presenter' && {
            filmTitle: formData.filmTitle,
            filmGenre: formData.filmGenre,
            screeningDetails: formData.screeningDetails || ''
          }),
          socialMedia: {
            instagram: formData.socialMedia.instagram || '',
            twitter: formData.socialMedia.twitter || '',
            linkedin: formData.socialMedia.linkedin || '',
            website: formData.socialMedia.website || '',
            youtube: formData.socialMedia.youtube || '',
            tiktok: formData.socialMedia.tiktok || ''
          }
        }),
      });

      if (response.ok) {
        setSubmitMessage('Submission created successfully!');
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        const error = await response.json();
        setSubmitMessage(`Error: ${error.error || 'Failed to submit'}`);
      }
    } catch (error) {
      setSubmitMessage('Network error. Please check if the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    {
      id: 'musician' as SubmitterRole,
      title: 'Musician',
      icon: 'fas fa-music',
      description: 'Submit your bio, headshots, music samples, and performance videos.'
    },
    {
      id: 'speaker' as SubmitterRole,
      title: 'Speaker',
      icon: 'fas fa-microphone',
      description: 'Share your bio, headshots, topic expertise, and speaking materials.'
    },
    {
      id: 'film-presenter' as SubmitterRole,
      title: 'Film Presenter',
      icon: 'fas fa-film',
      description: 'Upload your bio, headshots, film details, and promotional materials.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Your Assets</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose your role and share your professional materials with us
        </p>
      </div>

      {/* Role Selection with Better Cards */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Select Your Role
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                selectedRole === role.id
                  ? 'border-primary-500 bg-primary-50 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  selectedRole === role.id ? 'bg-primary-500' : 'bg-gray-100'
                }`}>
                  <i className={`${role.icon} text-2xl ${
                    selectedRole === role.id ? 'text-white' : 'text-gray-600'
                  }`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                <p className="text-gray-600 text-sm">{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Form */}
      {selectedRole && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900">
            <i className={`${roles.find(r => r.id === selectedRole)?.icon} mr-3 text-primary-600`}></i>
            {roles.find(r => r.id === selectedRole)?.title} Application
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Professional Bio (Optional)
              </label>
              <textarea
                rows={4}
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tell us about your experience, achievements, and what makes you unique... (Optional)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Optional: Share your background and expertise to help us understand your work better.
              </p>
            </div>

            {/* Role-Specific Fields */}
            {selectedRole === 'musician' && (
              <div className="space-y-4 bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h4 className="text-lg font-semibold text-purple-900 mb-4">
                  <i className="fas fa-music mr-2"></i>
                  Musician-Specific Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Music Genre *
                    </label>
                    <input
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Jazz, Rock, Classical, Hip-Hop"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Instruments Played *
                    </label>
                    <input
                      type="text"
                      name="instruments"
                      value={formData.instruments}
                      onChange={handleInputChange}
                      className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Piano, Guitar, Drums"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Music Samples / Links (Optional)
                  </label>
                  <textarea
                    rows={3}
                    name="musicLinks"
                    value={formData.musicLinks}
                    onChange={handleInputChange}
                    className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Share links to your music on Spotify, SoundCloud, YouTube, etc."
                  />
                </div>
              </div>
            )}

            {selectedRole === 'speaker' && (
              <div className="space-y-4 bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">
                  <i className="fas fa-microphone mr-2"></i>
                  Speaker-Specific Information
                </h4>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Speaking Topics / Expertise *
                  </label>
                  <input
                    type="text"
                    name="topics"
                    value={formData.topics}
                    onChange={handleInputChange}
                    className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Technology, Business, Leadership, Health & Wellness"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Speaking Experience (Optional)
                  </label>
                  <textarea
                    rows={3}
                    name="speakingExperience"
                    value={formData.speakingExperience}
                    onChange={handleInputChange}
                    className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us about your previous speaking engagements, conferences, or events"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Presentation Materials (Optional)
                  </label>
                  <textarea
                    rows={2}
                    name="presentationMaterials"
                    value={formData.presentationMaterials}
                    onChange={handleInputChange}
                    className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe any presentation materials, slides, or resources you'll provide"
                  />
                </div>
              </div>
            )}

            {selectedRole === 'film-presenter' && (
              <div className="space-y-4 bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h4 className="text-lg font-semibold text-orange-900 mb-4">
                  <i className="fas fa-film mr-2"></i>
                  Film Presenter-Specific Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Film Title *
                    </label>
                    <input
                      type="text"
                      name="filmTitle"
                      value={formData.filmTitle}
                      onChange={handleInputChange}
                      className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Title of your film"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Film Genre *
                    </label>
                    <input
                      type="text"
                      name="filmGenre"
                      value={formData.filmGenre}
                      onChange={handleInputChange}
                      className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Documentary, Drama, Comedy, Short Film"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Screening Details / Availability (Optional)
                  </label>
                  <textarea
                    rows={3}
                    name="screeningDetails"
                    value={formData.screeningDetails}
                    onChange={handleInputChange}
                    className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Share any screening dates, availability, or special requirements"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Assets (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                <p className="text-gray-600 mb-2">Drag and drop your files here, or click to browse</p>
                <input 
                  type="file" 
                  multiple
                  accept="image/*,audio/*,video/*,.pdf"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="btn-secondary cursor-pointer">
                  Choose Files
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Supported: Images, Audio, Video, PDF (Max 10MB each) - Optional
                </p>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Files:</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <i className="fas fa-file text-gray-500 mr-2"></i>
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Social Media & Online Presence (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    <i className="fab fa-instagram text-pink-500 mr-2"></i>
                    Instagram Username
                  </label>
                  <input
                    type="text"
                    name="social_instagram"
                    value={formData.socialMedia.instagram}
                    onChange={handleInputChange}
                    className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="@username or username"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    <i className="fab fa-twitter text-blue-400 mr-2"></i>
                    Twitter/X Username
                  </label>
                  <input
                    type="text"
                    name="social_twitter"
                    value={formData.socialMedia.twitter}
                    onChange={handleInputChange}
                    className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="@username or username"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    <i className="fab fa-linkedin text-blue-600 mr-2"></i>
                    LinkedIn Username
                  </label>
                  <input
                    type="text"
                    name="social_linkedin"
                    value={formData.socialMedia.linkedin}
                    onChange={handleInputChange}
                    className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="username"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    <i className="fas fa-globe text-gray-600 mr-2"></i>
                    Website
                  </label>
                  <input
                    type="url"
                    name="social_website"
                    value={formData.socialMedia.website}
                    onChange={handleInputChange}
                    className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    <i className="fab fa-youtube text-red-500 mr-2"></i>
                    YouTube Username
                  </label>
                  <input
                    type="text"
                    name="social_youtube"
                    value={formData.socialMedia.youtube}
                    onChange={handleInputChange}
                    className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="@username or username"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    <i className="fab fa-tiktok text-black mr-2"></i>
                    TikTok Username
                  </label>
                  <input
                    type="text"
                    name="social_tiktok"
                    value={formData.socialMedia.tiktok}
                    onChange={handleInputChange}
                    className="form-input focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="@username or username"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                <i className="fas fa-info-circle mr-1"></i>
                Just enter your usernames - no need for full URLs! This helps us find and connect with you online.
              </p>
            </div>

            {submitMessage && (
              <div className={`p-4 rounded-lg border ${
                submitMessage.includes('Error') || submitMessage.includes('Network') 
                  ? 'bg-red-50 border-red-200 text-red-700' 
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}>
                <div className="flex items-center">
                  <i className={`fas ${
                    submitMessage.includes('Error') ? 'fa-exclamation-circle' : 'fa-check-circle'
                  } mr-2`}></i>
                  {submitMessage}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Submit Assets
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
