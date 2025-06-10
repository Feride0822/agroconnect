/**
 * Authentication Service
 *
 * Handles all authentication-related operations including login, logout,
 * registration, and token management.
 */

import {
  apiClient,
  type LoginRequest,
  type RegisterRequest,
  type AuthResponse,
} from "@/lib/api-client";

export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginRequest): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      const response = await apiClient.login(credentials);

      if (response.success && response.data) {
        // Store refresh token
        if (response.data.refreshToken) {
          localStorage.setItem(
            "agroconnect-refresh-token",
            response.data.refreshToken,
          );
        }

        // Store user profile
        localStorage.setItem(
          "agroconnect-user-profile",
          JSON.stringify(response.data.user),
        );

        return {
          success: true,
          user: response.data.user,
        };
      }

      return {
        success: false,
        error: response.error || "Login failed",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Network error. Please check your connection and try again.",
      };
    }
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterRequest): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      const response = await apiClient.register(userData);

      if (response.success && response.data) {
        // Store refresh token
        if (response.data.refreshToken) {
          localStorage.setItem(
            "agroconnect-refresh-token",
            response.data.refreshToken,
          );
        }

        // Store user profile
        localStorage.setItem(
          "agroconnect-user-profile",
          JSON.stringify(response.data.user),
        );

        return {
          success: true,
          user: response.data.user,
        };
      }

      return {
        success: false,
        error: response.error || "Registration failed",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: "Network error. Please check your connection and try again.",
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Call logout endpoint to invalidate token on server
      await apiClient.logout();

      // Clear all local storage
      localStorage.removeItem("agroconnect-auth-token");
      localStorage.removeItem("agroconnect-refresh-token");
      localStorage.removeItem("agroconnect-user-profile");

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);

      // Still clear local storage even if API call fails
      localStorage.removeItem("agroconnect-auth-token");
      localStorage.removeItem("agroconnect-refresh-token");
      localStorage.removeItem("agroconnect-user-profile");

      return { success: true };
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!localStorage.getItem("agroconnect-auth-token");
  }

  /**
   * Get current user from cache
   */
  static getCurrentUser(): any | null {
    const userData = localStorage.getItem("agroconnect-user-profile");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await apiClient.refreshToken();

      if (response.success && response.data) {
        // Update refresh token if provided
        if (response.data.refreshToken) {
          localStorage.setItem(
            "agroconnect-refresh-token",
            response.data.refreshToken,
          );
        }

        // Update user profile if provided
        if (response.data.user) {
          localStorage.setItem(
            "agroconnect-user-profile",
            JSON.stringify(response.data.user),
          );
        }

        return { success: true };
      }

      return {
        success: false,
        error: response.error || "Failed to refresh token",
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Check if token is expired (basic check)
   */
  static isTokenExpired(): boolean {
    const token = localStorage.getItem("agroconnect-auth-token");
    if (!token) return true;

    try {
      // Decode JWT token to check expiry (basic implementation)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * Auto-refresh token if needed
   */
  static async autoRefreshToken(): Promise<boolean> {
    if (this.isTokenExpired()) {
      const result = await this.refreshToken();
      return result.success;
    }
    return true;
  }
}

export default AuthService;
