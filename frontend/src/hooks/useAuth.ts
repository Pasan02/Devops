import { useState, useEffect } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
  token: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userEmail: null,
    token: null
  });

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail");
      
      setAuthState({
        isAuthenticated: !!token,
        userEmail: userEmail,
        token: token
      });
    };

    // Check on mount
    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuthStatus);

    // Custom event for same-tab login/logout
    window.addEventListener('authStateChanged', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authStateChanged', checkAuthStatus);
    };
  }, []);

  const login = (token: string, email: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
    window.dispatchEvent(new CustomEvent('authStateChanged'));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    window.dispatchEvent(new CustomEvent('authStateChanged'));
  };

  const isTokenExpired = () => {
    const token = authState.token;
    if (!token) return true;
    
    try {
      // Basic JWT token expiration check
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  return {
    ...authState,
    login,
    logout,
    isTokenExpired
  };
}