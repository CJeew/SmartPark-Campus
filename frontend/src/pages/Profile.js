import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarCircle from '../components/AvatarCircle';
import UserRoleBadge from '../components/UserRoleBadge';
import VehicleTypeBadge from '../components/VehicleTypeBadge';
import InputField from '../components/InputField';
import FilterDropdown from '../components/FilterDropdown';
import LoadingSkeleton from '../components/LoadingSkeleton';
import UserSidebar from '../components/UserSidebar';
import { profileService } from '../services/profileService';
import { useToast } from '../context/ToastContext';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const InfoRow = ({ label, value, mono = false }) => (
  <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0">
    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide w-40 flex-shrink-0">{label}</p>
    <p className={`text-sm font-semibold text-gray-800 text-right flex-1 ${mono ? 'font-mono' : ''}`}>{value || '—'}</p>
  </div>
);

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
      setFormData({
        fullName: profileData.fullName || '',
        phoneNumber: profileData.phoneNumber || '',
        faculty: profileData.faculty || '',
        userType: profileData.userType || '',
        vehicleType: profileData.vehicleType || '',
        vehicleRegistration: profileData.vehicleRegistration || '',
      });
      setErrors({});
    } catch {
      showToast('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchProfileData(); }, [fetchProfileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    if (!formData.faculty) newErrors.faculty = 'Faculty is required';
    if (!formData.userType) newErrors.userType = 'User type is required';
    if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
    if (!formData.vehicleRegistration.trim()) newErrors.vehicleRegistration = 'Vehicle registration is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) { showToast('Please fix the errors below', 'error'); return; }
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
      localStorage.setItem('user', JSON.stringify(updatedProfile));
    } catch (error) {
      showToast(error.message || 'Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

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

  const handleNavChange = (section) => {
    if (section === 'browse-zones') {
      navigate('/zones');
    } else {
      navigate('/dashboard', { state: { section } });
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const facultyLabel =
    typeof profile?.faculty === 'string'
      ? profile.faculty
      : faculties.find(f => f.value === profile?.faculty)?.label || '—';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar
        activeSection="profile"
        onNavChange={handleNavChange}
        openTicketsCount={0}
      />

      <main className="flex-1 overflow-auto flex flex-col">
        {/* Sticky header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
            <p className="text-xs text-gray-400 mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m5.657 1.343l-.707.707M21 12h-1M17.657 17.657l-.707.707M12 21v-1M6.343 17.657l.707-.707M3 12H4M6.343 6.343l.707.707" />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 px-8 py-6 space-y-6">

          {/* ── Profile hero card ── */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-64" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ) : profile && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5 flex items-center gap-5">
              <div className="flex-shrink-0">
                <AvatarCircle src={profile.avatarUrl} name={profile.fullName} size="xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-800">{profile.fullName}</h3>
                  <UserRoleBadge 
                    role={
                      profile.roles?.includes('ADMIN') ? 'ADMIN' : 
                      profile.roles?.includes('WARDEN') ? 'WARDEN' : 
                      profile.roles?.includes('TECHNICIAN') ? 'TECHNICIAN' : 'USER'
                    } 
                    size="sm" 
                  />
                </div>
                <p className="text-sm text-gray-500">{profile.email}</p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <span className="text-xs text-gray-400">
                    ID: <span className="font-semibold text-gray-600 font-mono">{profile.universityId}</span>
                  </span>
                  <span className="text-xs text-gray-400">
                    Faculty: <span className="font-semibold text-gray-600">{facultyLabel}</span>
                  </span>
                  <span className="text-xs text-gray-400">
                    Type: <span className="font-semibold text-gray-600">{profile.userType}</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Bookings</p>
                {loading ? <Skeleton className="h-8 w-16 mt-1" /> : (
                  <p className="text-3xl font-bold text-gray-800 leading-tight">{stats.totalBookings || 0}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">All time</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v3H5V5zm0 8a2 2 0 012-2h10a2 2 0 012 2v3H5v-3z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Issues Reported</p>
                {loading ? <Skeleton className="h-8 w-16 mt-1" /> : (
                  <p className="text-3xl font-bold text-gray-800 leading-tight">{stats.ticketsSubmitted || 0}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">Tickets submitted</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── Personal information panel ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-800">Personal Information</h3>
                <p className="text-xs text-gray-400 mt-0.5">Account and contact details</p>
              </div>
              <div className="px-6 py-4">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                  </div>
                ) : isEditMode ? (
                  <div className="space-y-4">
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
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                        University ID
                      </label>
                      <input
                        type="text"
                        value={profile.universityId}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm cursor-not-allowed font-mono"
                      />
                      <p className="text-xs text-blue-500 mt-1">This field cannot be changed</p>
                    </div>
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
                ) : (
                  <div>
                    <InfoRow label="Full Name" value={profile.fullName} />
                    <InfoRow label="Phone Number" value={profile.phoneNumber} mono />
                    <InfoRow label="University ID" value={profile.universityId} mono />
                    <InfoRow label="Account Type" value={profile.userType} />
                    <InfoRow label="Faculty" value={facultyLabel} />
                    <InfoRow label="Email" value={profile.email} />
                  </div>
                )}
              </div>
            </div>

            {/* ── Vehicle information panel ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-800">Vehicle Information</h3>
                <p className="text-xs text-gray-400 mt-0.5">Registered vehicle details</p>
              </div>
              <div className="px-6 py-4">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                  </div>
                ) : isEditMode ? (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Vehicle Type
                      </label>
                      <div className="flex flex-wrap gap-2">
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
                      {errors.vehicleType && (
                        <p className="text-xs text-red-500 mt-1">{errors.vehicleType}</p>
                      )}
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
                ) : (
                  <div>
                    <div className="py-3 border-b border-gray-50">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Vehicle Type</p>
                      <VehicleTypeBadge type={profile.vehicleType || 'CAR'} size="md" />
                    </div>
                    <InfoRow label="Registration" value={profile.vehicleRegistration} mono />
                  </div>
                )}

                {/* Account status */}
                {!isEditMode && !loading && (
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Account Status</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        profile.userType === 'STAFF'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {profile.userType}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
