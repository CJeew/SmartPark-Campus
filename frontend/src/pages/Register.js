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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 py-8 px-4">
      {error && <Toast message={error} type="error" onClose={() => setError('')} duration={4000} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} duration={4000} />}

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">🚗</h1>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">SmartPark Registration</h2>
          <p className="text-gray-600 mt-2">Create your account to access the parking system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Google Sign-In Section */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700 mb-3 font-medium">Step 1: Sign in with Google</p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in failed')}
              theme="outline"
              size="large"
            />
            {formData.googleId && (
              <p className="text-green-600 text-sm mt-2">✓ Google account linked</p>
            )}
          </div>

          {/* Personal Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>

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
              disabled={formData.googleId}
            />

            <InputField
              label="University ID / Index Number"
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
              placeholder="0712345678"
            />

            <FilterDropdown
              label="Faculty / Department"
              options={FACULTIES}
              value={formData.faculty}
              onChange={(value) => handleSelectChange('faculty', value)}
              error={errors.faculty}
              required
            />

            <FilterDropdown
              label="User Type"
              options={USER_TYPES}
              value={formData.userType}
              onChange={(value) => handleSelectChange('userType', value)}
              error={errors.userType}
              required
            />
          </div>

          {/* Vehicle Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4">Vehicle Information</h3>

            <VehicleTypeBadge
              types={VEHICLE_TYPES}
              selectedType={formData.vehicleType}
              onSelect={(type) => handleSelectChange('vehicleType', type)}
            />
            {errors.vehicleType && <p className="text-red-500 text-sm mb-4">{errors.vehicleType}</p>}

            <InputField
              label="Vehicle Registration Number"
              name="vehicleRegistrationNumber"
              value={formData.vehicleRegistrationNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.vehicleRegistrationNumber}
              required
              placeholder="e.g., CAR-2345"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading || !formData.googleId}
          >
            Create Account
          </Button>

          {/* Login Link */}
          <p className="text-center text-gray-700 mt-4">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              Login here
            </button>
          </p>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-300 mt-8 pt-6 flex justify-center gap-4 text-sm">
          <button type="button" className="text-gray-600 hover:text-blue-600 transition">
            Privacy Policy
          </button>
          <span className="text-gray-400">•</span>
          <button type="button" className="text-gray-600 hover:text-blue-600 transition">
            Terms of Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
