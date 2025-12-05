'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AllAssignment() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get('/api/assignments/submit');
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) return <div>Loading submissions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Assignment Submissions</h2>

      {submissions.length === 0 ? (
        <div>No submissions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 shadow-lg rounded-lg">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Module</th>
                <th className="border px-4 py-2 text-left">Google Drive Link</th>
                <th className="border px-4 py-2 text-left">Text Answer</th>
                <th className="border px-4 py-2 text-left">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id} className="hover:bg-gray-100 transition">
                  <td className="border px-4 py-2">{submission.userName}</td>
                  <td className="border px-4 py-2">{submission.userEmail}</td>
                  <td className="border px-4 py-2">{submission.module}</td>
                  <td className="border px-4 py-2">
                    {submission.googleDriveLink ? (
                      <a
                        href={submission.googleDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Link
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="border px-4 py-2">{submission.textAnswer || '-'}</td>
                  <td className="border px-4 py-2">
                    {new Date(submission.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
