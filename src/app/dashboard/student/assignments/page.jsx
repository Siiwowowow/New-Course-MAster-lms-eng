'use client';

import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '@/hooks/useAuth';
import { AlertCircleIcon, CheckCircleIcon, FileTextIcon, Loader2Icon, PaperclipIcon, UploadIcon } from 'lucide-react';
import { FaPaperPlane } from 'react-icons/fa';


export default function AssignmentSubmitForm() {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    module: '',
    googleDriveLink: '',
    textAnswer: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'link'

  const isUserLoaded = !loading && user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isUserLoaded) {
      setMessage({ 
        text: 'User information is still loading. Please wait...', 
        type: 'error' 
      });
      return;
    }

    if (!formData.module.trim()) {
      setMessage({ 
        text: 'Please enter the module name.', 
        type: 'error' 
      });
      return;
    }

    if (!formData.googleDriveLink && !formData.textAnswer.trim()) {
      setMessage({ 
        text: 'Please provide either a Google Drive link or a text answer.', 
        type: 'error' 
      });
      return;
    }

    try {
      setSubmitting(true);
      setMessage({ text: '', type: '' });

      await axios.post('/api/assignments/submit', {
        module: formData.module.trim(),
        googleDriveLink: formData.googleDriveLink.trim(),
        textAnswer: formData.textAnswer.trim(),
        userName: user.displayName || 'No Name',
        userEmail: user.email,
        userUid: user.uid,
        submittedAt: new Date().toISOString(),
      });

      setMessage({ 
        text: 'Assignment submitted successfully!', 
        type: 'success' 
      });
      
      setFormData({
        module: '',
        googleDriveLink: '',
        textAnswer: '',
      });
      setActiveTab('text');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
    } catch (error) {
      console.error('Submission error:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Submission failed. Please try again.', 
        type: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
          <p className="text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <PaperclipIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Submit Assignment
          </h1>
          <p className="text-gray-600">
            Submit your work for evaluation and feedback
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Student Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {user?.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="font-medium text-gray-900">
                  {user?.displayName || 'No Name'}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Email</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900 font-medium">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <span className={`font-medium ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.text}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Module Input */}
            <div className="space-y-2">
              <label htmlFor="module" className="text-sm font-medium text-gray-900">
                Module Name *
              </label>
              <input
                id="module"
                name="module"
                type="text"
                required
                value={formData.module}
                onChange={handleChange}
                placeholder="e.g., Computer Science 101"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Submission Type Tabs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">
                  Submission Content *
                </label>
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveTab('text')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'text'
                        ? 'bg-white shadow-sm text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FileTextIcon className="w-4 h-4 inline mr-2" />
                    Text Answer
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('link')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'link'
                        ? 'bg-white shadow-sm text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <UploadIcon className="w-4 h-4 inline mr-2" />
                    File Link
                  </button>
                </div>
              </div>

              {/* Text Answer Tab */}
              {activeTab === 'text' && (
                <div className="space-y-2 animate-fadeIn">
                  <textarea
                    name="textAnswer"
                    value={formData.textAnswer}
                    onChange={handleChange}
                    placeholder="Type your answer here... (Markdown supported)"
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  />
                  <p className="text-sm text-gray-500">
                    You can use Markdown formatting for better presentation.
                  </p>
                </div>
              )}

              {/* File Link Tab */}
              {activeTab === 'link' && (
                <div className="space-y-2 animate-fadeIn">
                  <input
                    name="googleDriveLink"
                    type="url"
                    value={formData.googleDriveLink}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <p className="text-sm text-gray-500">
                    Please ensure your Google Drive file is set to  Anyone with the link can view
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting || !isUserLoaded}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {submitting ? (
                  <>
                    <Loader2Icon className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-5 h-5" />
                    Submit Assignment
                  </>
                )}
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">
                You will receive a confirmation email after submission
              </p>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support at{" "}
            <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700">
              support@example.com
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}