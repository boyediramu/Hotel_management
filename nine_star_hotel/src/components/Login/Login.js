import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const formRef = useRef(null);

  // Initialize empty form on mount
  useEffect(() => {
    // Initialize with empty form data
    setFormData({
      email: '',
      password: ''
    });
  }, []);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Map field names to state properties (completely dynamic)
    const fieldMap = {
      'user_email': 'email',
      'user_password': 'password',
      'email': 'email',
      'password': 'password'
    };

    const stateField = fieldMap[name] || name;

    // Update form data dynamically
    setFormData(prev => ({
      ...prev,
      [stateField]: value
    }));

    // Clear any existing errors for this field
    if (errors[stateField]) {
      setErrors(prev => ({
        ...prev,
        [stateField]: ''
      }));
    }
  };
 
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Clear any previous errors

    try {


      // Make dynamic API call to backend
      const response = await axios.post('http://localhost:5000/api/admins/login', {
        email: formData.email.trim(),
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      console.log('� API Response received:', {
        status: response.status,
        success: response.data.success,
        hasUser: !!response.data.user
      });

      // Check if login was successful
      if (response.data.success && response.data.user) {
        // Create user data object for localStorage
        const userData = {
          id: response.data.user.admin_id || response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          fullName: response.data.user.full_name || response.data.user.fullName,
          role: response.data.user.role,
          loginTime: new Date().toISOString(),
          sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
        };



        // Store authentication data
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('loginTimestamp', userData.loginTime);

        // Verify storage was successful
        const verification = {
          userData: localStorage.getItem('userData'),
          isAuthenticated: localStorage.getItem('isAuthenticated'),
          loginTimestamp: localStorage.getItem('loginTimestamp')
        };

        if (verification.userData && verification.isAuthenticated === 'true') {
          console.log('✅ Authentication data stored successfully');

          // Call success callback
          if (onLoginSuccess) {
            onLoginSuccess(userData);
          }
        } else {
          throw new Error('Failed to store authentication data');
        }
      } else {
        // Handle unsuccessful login
        const errorMessage = response.data.message || 'Invalid email or password';
        setErrors({ general: errorMessage });
        console.log('❌ Login failed:', errorMessage);
      }
    } catch (error) {
      console.error('❌ Login error:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message ||
                     `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Login request timed out. Please try again.';
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Hotel Management</h1>
          <p>Admin Panel Login</p>
        </div>

        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="login-form"
          autoComplete="off"
          noValidate
        >

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address *</label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              name="user_email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
              disabled={isLoading}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password *</label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              name="user_password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
