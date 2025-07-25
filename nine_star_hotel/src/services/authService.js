import { authAPI } from './api';

// Authentication service
class AuthService {
  constructor() {
    this.tokenKey = 'authToken';
    this.userKey = 'userData';
  }

  // Login user
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        // Store user data and token (if provided)
        const userData = {
          email: response.email,
          role: response.role,
          timestamp: new Date().toISOString()
        };
        
        this.setUserData(userData);
        
        // If token is provided in response, store it
        if (response.token) {
          this.setToken(response.token);
        }
        
        return { success: true, user: userData };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Logout user
  logout() {
    this.removeToken();
    this.removeUserData();
  }

  // Check if user is authenticated
  isAuthenticated() {
    const userData = this.getUserData();
    return userData !== null;
  }

  // Get current user data
  getCurrentUser() {
    return this.getUserData();
  }

  // Token management
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // User data management
  setUserData(userData) {
    localStorage.setItem(this.userKey, JSON.stringify(userData));
  }

  getUserData() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  removeUserData() {
    localStorage.removeItem(this.userKey);
  }

  // Check if user has specific role
  hasRole(role) {
    const userData = this.getUserData();
    return userData && userData.role === role;
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole('admin');
  }

  // Validate session (check if token is still valid)
  async validateSession() {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }

      // In a real application, you would validate the token with the server
      // For now, we'll just check if user data exists
      const userData = this.getUserData();
      return userData !== null;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  // Auto-logout after inactivity (future implementation)
  setupAutoLogout(timeoutMinutes = 30) {
    let timeoutId;
    
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.logout();
        window.location.reload();
      }, timeoutMinutes * 60 * 1000);
    };

    // Reset timeout on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });

    // Initial timeout setup
    resetTimeout();
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
