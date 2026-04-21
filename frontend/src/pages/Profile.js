import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AvatarCircle from '../components/AvatarCircle';
import UserRoleBadge from '../components/UserRoleBadge';
import VehicleTypeBadge from '../components/VehicleTypeBadge';
import StatusBadge from '../components/StatusBadge';
import InputField from '../components/InputField';
import FilterDropdown from '../components/FilterDropdown';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { profileService } from '../services/profileService';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ totalBookings: 0, ticketsSubmitted: 0 });
  const [faculties, setFaculties] = useState([]);
  const [errors, setErrors] = useState({});

  // Form state for editing
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    faculty: '',
    userType: '',
    vehicleType: '',
    vehicleRegistration: '',
  });

  const userTypeOptions = [
    { value: 'STUDENT', label: 'Student' },
    { value: 'STAFF', label: 'Staff' },
  ];

  const vehicleTypeOptions = [
    { value: 'CAR', label: 'Car' },
    { value: 'BIKE', label: 'Bike' },
    { value: 'THREE_WHEELER', label: '3-Wheeler' },
  ];

  // Fetch profile data
  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, statsData, facultiesData] = await Promise.all([
        profileService.getCurrentProfile(),
        profileService.getUserStats(),
        profileService.getFaculties(),
      ]);

      setProfile(profileData);
      setStats(statsData);
      setFaculties(
        facultiesData.length > 0
          ? facultiesData
          : [
              { value: 'computing', label: 'Faculty of Computing' },
              { value: 'engineering', label: 'Faculty of Engineering' },
              { value: 'business', label: 'Faculty of Business' },
            ]
      );

      // Initialize form with profile data
      setFormData({
        fullName: profileData.fullName || '',
        phoneNumber: profileData.phoneNumber || '',
        faculty: profileData.faculty || '',
        userType: profileData.userType || '',
        vehicleType: profileData.vehicleType || '',
        vehicleRegistration: profileData.vehicleRegistration || '',
      });

      setErrors({});
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle dropdown changes
  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    if (!formData.faculty) {
      newErrors.faculty = 'Faculty is required';
    }
    if (!formData.userType) {
      newErrors.userType = 'User type is required';
    }
    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vehicle type is required';
    }
    if (!formData.vehicleRegistration.trim()) {
      newErrors.vehicleRegistration = 'Vehicle registration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!validateForm()) {
      showToast('Please fix the errors below', 'error');
      return;
    }

    setSaving(true);
    try {
      const updatedProfile = await profileService.updateProfile({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        faculty: formData.faculty,
        userType: formData.userType,
        vehicleType: formData.vehicleType,
        vehicleRegistration: formData.vehicleRegistration,
      });

      setProfile(updatedProfile);
      setIsEditMode(false);
      showToast('Profile updated successfully', 'success');
      
      // Update localStorage user data
      localStorage.setItem('user', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast(error.message || 'Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setFormData({
      fullName: profile?.fullName || '',
      phoneNumber: profile?.phoneNumber || '',
      faculty: profile?.faculty || '',
      userType: profile?.userType || '',
      vehicleType: profile?.vehicleType || '',
      vehicleRegistration: profile?.vehicleRegistration || '',
    });
    setErrors({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <LoadingSkeleton type="text" count={5} />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 px-8 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 border border-gray-200">
          <p className="text-center text-gray-500">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 sm:px-8 py-12 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h1 className="text-4xl font-bold">My Profile</h1>
              <p className="text-blue-100 mt-1">Manage your account settings and vehicle information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-12 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <AvatarCircle
                  src={profile.avatarUrl}
                  name={profile.fullName}
                  size="xl"
                />
              </div>

              {/* Header Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-4">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {profile.fullName}
                  </h2>
                  <UserRoleBadge role={profile.role || 'USER'} size="md" />
                </div>

                <p className="text-gray-600 mb-4">{profile.email}</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                    <p className="text-sm text-gray-600">University ID</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.universityId}</p>
                  </div>
                  <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                    <p className="text-sm text-gray-600">Faculty</p>
                    <p className="text-lg font-semibold text-gray-900">{typeof profile.faculty === 'string' ? profile.faculty : 'Computing'}</p>
                  </div>
                  <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.userType}</p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditMode && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg whitespace-nowrap flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="px-8 py-8 space-y-8">
            {/* Personal Information Section */}
            <div className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Personal Information
            </h2>

            {isEditMode ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Full Name"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    error={errors.fullName}
                    required
                  />

                  <InputField
                    label="Phone Number"
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    error={errors.phoneNumber}
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University ID
                  </label>
                  <input
                    type="text"
                    value={profile.universityId}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-blue-600 mt-2">💡 This field cannot be changed</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FilterDropdown
                    label="Faculty"
                    options={faculties}
                    value={formData.faculty}
                    onChange={(value) => handleDropdownChange('faculty', value)}
                    placeholder="Select Faculty"
                  />

                  <FilterDropdown
                    label="Account Type"
                    options={userTypeOptions}
                    value={formData.userType}
                    onChange={(value) => handleDropdownChange('userType', value)}
                    placeholder="Select Account Type"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Full Name</p>
                  <p className="text-2xl font-bold text-gray-900">{profile.fullName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Phone Number</p>
                  <p className="text-xl font-semibold text-gray-900">{profile.phoneNumber}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">University ID</p>
                  <p className="text-xl font-semibold text-gray-900 font-mono">{profile.universityId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Account Type</p>
                  <p className="text-xl font-semibold text-gray-900">{profile.userType}</p>
                </div>
                <div className="md:col-span-2 bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Faculty</p>
                  <p className="text-xl font-semibold text-gray-900">{typeof profile.faculty === 'string' ? profile.faculty : faculties.find(f => f.value === profile.faculty)?.label || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Information Section */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v2m0 0v2m0-2H8m0 0H6m0 0v2m0-2H4" />
              </svg>
              Vehicle Information
            </h2>

            {isEditMode ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Vehicle Type</label>
                    <div className="flex gap-3">
                      {vehicleTypeOptions.map(type => (
                        <VehicleTypeBadge
                          key={type.value}
                          type={type.value}
                          selected={formData.vehicleType === type.value}
                          onClick={() => handleDropdownChange('vehicleType', type.value)}
                          size="md"
                        />
                      ))}
                    </div>
                    {errors.vehicleType && <p className="text-sm text-red-600 mt-2">{errors.vehicleType}</p>}
                  </div>

                  <InputField
                    label="Vehicle Registration"
                    type="text"
                    name="vehicleRegistration"
                    value={formData.vehicleRegistration}
                    onChange={handleInputChange}
                    placeholder="e.g., ABC-1234"
                    error={errors.vehicleRegistration}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Vehicle Type</p>
                  <VehicleTypeBadge type={profile.vehicleType || 'CAR'} size="md" />
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Registration Number</p>
                  <p className="text-xl font-semibold text-gray-900 font-mono">{profile.vehicleRegistration}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Your Activity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
                    <p className="text-5xl font-bold mt-2">{stats.totalBookings || 0}</p>
                  </div>
                  <div className="text-6xl opacity-20">📅</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Issues Reported</p>
                    <p className="text-5xl font-bold mt-2">{stats.ticketsSubmitted || 0}</p>
                  </div>
                  <div className="text-6xl opacity-20">🎫</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditMode && (
            <div className="pt-8 border-t border-gray-200 flex gap-4 justify-end">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m5.657 1.343l-.707.707m2.121 2.121h1m-.707 5.657l.707.707M12 21v-1m-5.657-1.343l.707-.707M5.05 5.05L3.636 3.636m5.657 12.728l-.707.707" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
          </div>

        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-lg transition-all hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          {!isEditMode && (
            <button
              onClick={() => setIsEditMode(true)}
              className="ml-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit My Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
