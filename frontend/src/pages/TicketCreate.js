import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import UserSidebar from '../components/UserSidebar';
import { ticketService } from '../services/ticketService';
import { useToast } from '../context/ToastContext';

const TicketCreate = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'LOW',
    location: '',
    resourceType: '',
    resourceId: '',
    description: '',
    preferredContactMethod: 'EMAIL',
    preferredContactName: '',
    preferredContactEmail: '',
    preferredContactPhone: ''
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const reasons = rejectedFiles[0].errors.map(e => e.message).join(', ');
      showToast(`File rejected: ${reasons}`, 'error');
      return;
    }
    const remaining = 3 - images.length;
    let toAdd = acceptedFiles;
    if (toAdd.length > remaining) {
      showToast(`You can only attach up to 3 images. ${remaining} slot(s) remaining.`, 'error');
      toAdd = toAdd.slice(0, remaining);
    }
    setImages(prev => [...prev, ...toAdd]);
  }, [images, showToast]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxSize: 10 * 1024 * 1024, // 10MB per file
    disabled: images.length >= 3,
  });

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.title || !formData.category || !formData.description || !formData.location) {
        showToast('Please fill in all required fields.', 'error');
        setLoading(false);
        return;
      }

      await ticketService.createTicket(formData, images);
      showToast('Ticket submitted successfully!', 'success');
      navigate('/dashboard');
    } catch (error) {
      showToast(error.message || 'Failed to submit ticket', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNavChange = (section) => {
    navigate('/dashboard', { state: { section } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar activeSection="dashboard" onNavChange={handleNavChange} />

      <main className="flex-1 overflow-auto flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl space-y-8">

          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Create an Incident Ticket
            </h2>
            <p className="mt-4 text-lg leading-6 text-gray-500">
              Report an issue with a specific resource or location.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">

              {/* Basic Info Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Issue Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="E.g., Damaged Projector in Lab A"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      <option value="HARDWARE">Hardware</option>
                      <option value="SOFTWARE">Software</option>
                      <option value="NETWORK">Network</option>
                      <option value="FACILITY">Facility</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="E.g., Room 402, Main Building"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Resource Type (Optional)</label>
                    <input
                      type="text"
                      name="resourceType"
                      value={formData.resourceType}
                      onChange={handleInputChange}
                      placeholder="E.g., Projector, AC Unit"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Resource ID (Optional)</label>
                    <input
                      type="text"
                      name="resourceId"
                      value={formData.resourceId}
                      onChange={handleInputChange}
                      placeholder="E.g., PRJ-001"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Provide a detailed description of the issue..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    required
                  ></textarea>
                </div>
              </div>

              {/* Evidence Section — react-dropzone */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Evidence &amp; Attachments</h3>
                <p className="text-sm text-gray-500">
                  Attach up to 3 images (PNG, JPG, GIF, WEBP — max 10 MB each).
                </p>

                {/* Drop zone */}
                <div
                  {...getRootProps()}
                  className={[
                    'flex flex-col items-center justify-center w-full h-52',
                    'border-2 border-dashed rounded-xl outline-none select-none',
                    'transition-all duration-200',
                    images.length >= 3
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : isDragReject
                      ? 'border-red-400 bg-red-50 cursor-not-allowed'
                      : isDragActive
                      ? 'border-indigo-500 bg-indigo-100 shadow-lg scale-[1.01] cursor-copy'
                      : 'border-indigo-300 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 cursor-pointer',
                  ].join(' ')}
                >
                  <input {...getInputProps()} />

                  {images.length >= 3 ? (
                    <>
                      <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-semibold text-gray-500">Maximum 3 images attached</p>
                      <p className="text-xs text-gray-400 mt-1">Remove an image below to replace it</p>
                    </>
                  ) : isDragReject ? (
                    <>
                      <svg className="w-10 h-10 mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-semibold text-red-500">Invalid file type</p>
                      <p className="text-xs text-red-400 mt-1">Only PNG, JPG, GIF, WEBP images are accepted</p>
                    </>
                  ) : isDragActive ? (
                    <>
                      <svg className="w-10 h-10 mb-3 text-indigo-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm font-semibold text-indigo-600">Drop your images here!</p>
                    </>
                  ) : (
                    <>
                      <svg className="w-10 h-10 mb-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm font-semibold text-gray-600">
                        <span className="text-indigo-600">Click to upload</span> or drag &amp; drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, GIF, WEBP — max 10 MB each</p>
                      <div className="mt-3 flex items-center gap-1.5">
                        {[0, 1, 2].map(i => (
                          <span
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${i < images.length ? 'bg-indigo-500' : 'bg-gray-300'}`}
                          />
                        ))}
                        <span className="ml-1.5 text-xs text-gray-400">{images.length}/3 attached</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative rounded-xl overflow-hidden border border-gray-200 group h-32 shadow-sm">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`preview-${index}`}
                          className="w-full h-full object-cover"
                        />
                        {/* File name badge */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
                          <p className="text-white text-xs truncate">{img.name}</p>
                        </div>
                        {/* Remove button */}
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none transform hover:scale-110 transition-transform shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Preferred Contact Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Method</label>
                    <select
                      name="preferredContactMethod"
                      value={formData.preferredContactMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                    >
                      <option value="EMAIL">Email</option>
                      <option value="PHONE">Phone</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
                    <input
                      type="text"
                      name="preferredContactName"
                      value={formData.preferredContactName}
                      onChange={handleInputChange}
                      placeholder="E.g., Jane Doe"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {formData.preferredContactMethod === 'EMAIL' ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="preferredContactEmail"
                      value={formData.preferredContactEmail}
                      onChange={handleInputChange}
                      placeholder="jane@university.edu"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="preferredContactPhone"
                      value={formData.preferredContactPhone}
                      onChange={handleInputChange}
                      placeholder="0712345678"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="mr-4 px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 border border-transparent text-sm font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Ticket'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketCreate;
