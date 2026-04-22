import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Toast from '../components/Toast';
import VehicleTypeBadge from '../components/VehicleTypeBadge';
import FilterDropdown from '../components/FilterDropdown';
import { authService } from '../services/authService';

const FACULTIES = [
  'Faculty of Computing',
  'Faculty of Engineering',
  'Faculty of Business',
  'Faculty of Law',
  'Faculty of Health',
  'Faculty of Science'
];

const USER_TYPES = ['STUDENT', 'STAFF'];
const VEHICLE_TYPES = ['CAR', 'BIKE', 'THREE_WHEELER'];

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [touchedFields, setTouchedFields] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    universityId: '',
    phoneNumber: '',
    faculty: '',
    userType: '',
    vehicleType: '',
    vehicleRegistrationNumber: '',
    googleId: '',
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    delete newErrors[name];

    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          newErrors[name] = 'Full name is required';
        }
        break;
      case 'email':
        if (!value) {
          newErrors[name] = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[name] = 'Invalid email format';
        }
        break;
      case 'universityId':
        if (!value.trim()) {
          newErrors[name] = 'University ID is required';
        }
        break;
      case 'phoneNumber':
        if (!value.trim()) {
          newErrors[name] = 'Phone number is required';
        } else if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) {
          newErrors[name] = 'Phone number must be 10 digits';
        }
        break;
      case 'faculty':
        if (!value) {
          newErrors[name] = 'Faculty is required';
        }
        break;
      case 'userType':
        if (!value) {
          newErrors[name] = 'User type is required';
        }
        break;
      case 'vehicleType':
        if (!value) {
          newErrors[name] = 'Vehicle type is required';
        }
        break;
      case 'vehicleRegistrationNumber':
        if (!value.trim()) {
          newErrors[name] = 'Vehicle registration number is required';
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touchedFields[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields({ ...touchedFields, [name]: true });
    validateField(name, value);
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setTouchedFields({ ...touchedFields, [name]: true });
    validateField(name, value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.universityId.trim()) newErrors.universityId = 'University ID is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.faculty) newErrors.faculty = 'Faculty is required';
    if (!formData.userType) newErrors.userType = 'User type is required';
    if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
    if (!formData.vehicleRegistrationNumber.trim()) newErrors.vehicleRegistrationNumber = 'Vehicle registration number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const decoded = JSON.parse(atob(token.split('.')[1]));

      setFormData({
        ...formData,
        email: decoded.email,
        fullName: decoded.name,
        googleId: decoded.sub,
      });
      setSuccess('Google account linked successfully!');
    } catch (err) {
      setError('Failed to process Google account');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    if (!formData.googleId) {
      setError('Please sign in with Google first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);
      if (response.success) {
        setSuccess('Registration successful! Redirecting to dashboard...');
        setTimeout(() => {
          const user = response.user;
          const hasAdminRole = user.roles.includes('ADMIN');
          navigate(hasAdminRole ? '/admin/dashboard' : '/dashboard');
        }, 1500);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 py-12 px-4">
      {error && <Toast message={error} type="error" duration={4000} />}
      {success && <Toast message={success} type="success" duration={4000} />}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <h1 className="text-5xl font-bold mb-4">🚗 SmartPark</h1>
          <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
          <p className="text-blue-100 text-lg">Join thousands of students managing parking efficiently</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6">
            <h3 className="text-2xl font-bold">Registration Form</h3>
            <p className="text-blue-100 mt-1">Complete all fields to create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Step 1: Google Authentication */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">1</span>
                <h3 className="text-lg font-semibold text-gray-900">Link Your Google Account</h3>
              </div>
              <p className="text-gray-600 mb-4">Sign in with your SLIIT Google account to get started</p>
              <div className="mx-auto max-w-sm">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google sign-in failed')}
                  theme="outline"
                  size="large"
                />
              </div>
              {formData.googleId && (
                <p className="text-green-600 text-sm mt-4 flex items-center gap-2">
                  <span>✓</span> Google account linked successfully
                </p>
              )}
            </div>

            {/* Step 2: Personal Information */}
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">2</span>
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.fullName}
                  required
                  placeholder="Enter your full name"
                />

                <InputField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  required
                  placeholder="your.email@sliit.lk"
                  disabled={!!formData.googleId}
                />

                <InputField
                  label="University ID"
                  name="universityId"
                  value={formData.universityId}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.universityId}
                  required
                  placeholder="e.g., IT001234"
                />

                <InputField
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.phoneNumber}
                  required
                  placeholder="0700000000"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FilterDropdown
                  label="Faculty"
                  options={FACULTIES.map(f => ({ value: f, label: f }))}
                  value={formData.faculty}
                  onChange={(value) => handleSelectChange('faculty', value)}
                  placeholder="Select your faculty"
                />

                <FilterDropdown
                  label="Account Type"
                  options={USER_TYPES.map(t => ({ value: t, label: t }))}
                  value={formData.userType}
                  onChange={(value) => handleSelectChange('userType', value)}
                  placeholder="Select account type"
                />
              </div>
            </div>

            {/* Step 3: Vehicle Information */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">3</span>
                <h3 className="text-lg font-semibold text-gray-900">Vehicle Information</h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {VEHICLE_TYPES.map(type => (
                    <label
                      key={type}
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.vehicleType === type
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="vehicleType"
                        value={type}
                        checked={formData.vehicleType === type}
                        onChange={handleInputChange}
                        className="w-4 h-4"
                      />
                      <span className="text-2xl">
                        {type === 'CAR' && '🚗'}
                        {type === 'BIKE' && '🏍️'}
                        {type === 'THREE_WHEELER' && '🛺'}
                      </span>
                      <span className="text-sm font-medium">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.vehicleType && (
                  <p className="text-red-600 text-sm mb-4">❌ {errors.vehicleType}</p>
                )}
              </div>

              <InputField
                label="Vehicle Registration Number"
                name="vehicleRegistrationNumber"
                value={formData.vehicleRegistrationNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.vehicleRegistrationNumber}
                required
                placeholder="e.g., ABC-1234"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                {loading ? '⏳ Creating Account...' : '✅ Create Account'}
              </button>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Security Note */}
        <div className="text-center mt-8 text-white text-sm">
          <p>🔒 Your information is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
