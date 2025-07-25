import { useState, useEffect } from 'react';
import authService from '../services/authService';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkAuth = async () => {
      try {
        const isValid = await authService.validateSession();
        if (isValid) {
          const userData = authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth validation error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const result = await authService.login(credentials);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (role) => {
    return authService.hasRole(role);
  };

  const isAdmin = () => {
    return authService.isAdmin();
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    hasRole,
    isAdmin
  };
};

export default useAuth;
