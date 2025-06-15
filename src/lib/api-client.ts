/**
 * API Client Service for AgroConnect
 *
 * This service provides a centralized way to handle all API calls to the backend.
 * It includes authentication, error handling, and request/response transformation.
 */

// Configuration
const API_CONFIG = {
  // Change these URLs based on your backend deployment
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
  retries: 3,
};

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User profile types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Farmers" | "Exporters" | "Analysts";
  region: string;
  organization: string;
  joinDate: string;
  verified: boolean;
  rating: number;
  completedTransactions: number;
  totalVolume: number;
  avatar?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  region?: string;
  organization?: string;
}

// Farmer types
export interface FarmerProfile {
  id: string;
  name: string;
  farmName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  telegram?: string;
  regionId: string;
  farmSize: number;
  experience: number;
  specialization: string[];
  verified: boolean;
  rating: number;
  totalTransactions: number;
  profileImage?: string;
  description: string;
  certifications: string[];
  joinDate: string;
  products: FarmerProduct[];
}

export interface FarmerProduct {
  id: string;
  name: string;
  category: "grains" | "fruits" | "vegetables" | "cotton" | "livestock";
  amount: number;
  unit: string;
  area: number;
  pricePerUnit: number;
  totalValue: number;
  harvestDate: string;
  qualityGrade: "A" | "B" | "C";
  organic: boolean;
  available: boolean;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  region: string;
  organization?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserProfile;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
    this.loadTokenFromStorage();
  }

  /**
   * Load authentication token from localStorage
   */
  private loadTokenFromStorage() {
    this.token = localStorage.getItem("agroconnect-auth-token");
  }

  /**
   * Save authentication token to localStorage
   */
  private saveTokenToStorage(token: string) {
    this.token = token;
    localStorage.setItem("agroconnect-auth-token", token);
  }

  /**
   * Remove authentication token
   */
  private removeTokenFromStorage() {
    this.token = null;
    localStorage.removeItem("agroconnect-auth-token");
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Generic request method with error handling and retries
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    let lastError: Error;

    // Retry logic
    for (let attempt = 1; attempt <= API_CONFIG.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!response.ok) {
          // Handle specific HTTP errors
          if (response.status === 401) {
            this.removeTokenFromStorage();
            return {
              success: false,
              error: "Authentication required. Please log in again.",
            };
          }

          if (response.status === 403) {
            return {
              success: false,
              error:
                "Access denied. You do not have permission to perform this action.",
            };
          }

          return {
            success: false,
            error: data.message || data.error || `HTTP ${response.status}`,
          };
        }

        return {
          success: true,
          data: data.data || data,
          message: data.message,
        };
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (
          error instanceof TypeError ||
          (error as any).name === "AbortError"
        ) {
          break;
        }

        // Wait before retry (exponential backoff)
        if (attempt < API_CONFIG.retries) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000),
          );
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || "Network error occurred",
    };
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // ===================
  // AUTHENTICATION APIs
  // ===================

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.post<AuthResponse>("/accounts/login", credentials);

    if (response.success && response.data?.token) {
      this.saveTokenToStorage(response.data.token);
    }

    return response;
  }

  /**
   * Register new user
   */
  async register(
    userData: RegisterRequest,
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.post<AuthResponse>("/accounts/register", userData);

    if (response.success && response.data?.token) {
      this.saveTokenToStorage(response.data.token);
    }

    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    const response = await this.post<void>("/accounts/logout");
    this.removeTokenFromStorage();
    return response;
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem("agroconnect-refresh-token");

    if (!refreshToken) {
      return {
        success: false,
        error: "No refresh token available",
      };
    }

    const response = await this.post<AuthResponse>("/accounts/token/refresh", {
      refreshToken,
    });

    if (response.success && response.data?.token) {
      this.saveTokenToStorage(response.data.token);
    }

    return response;
  }

  // ===================
  // USER PROFILE APIs
  // ===================

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    return this.get<UserProfile>("/accounts/profile");
  }

  /**
   * Update user profile
   */
  async updateProfile(
    updates: UpdateProfileRequest,
  ): Promise<ApiResponse<UserProfile>> {
    return this.put<UserProfile>("/accounts/profile", updates);
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${this.baseURL}/user/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to upload avatar",
      };
    }

    return {
      success: true,
      data,
    };
  }

  // ===================
  // FARMERS APIs
  // ===================

  /**
   * Get all farmers with optional filters
   */
  async getFarmers(params?: {
    page?: number;
    limit?: number;
    region?: string;
    specialization?: string;
    search?: string;
  }): Promise<PaginatedResponse<FarmerProfile>> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/farmers?${queryString}` : "/farmers";

    return this.get<FarmerProfile[]>(endpoint) as Promise<
      PaginatedResponse<FarmerProfile>
    >;
  }

  /**
   * Get farmer by ID
   */
  async getFarmerById(id: string): Promise<ApiResponse<FarmerProfile>> {
    return this.get<FarmerProfile>(`/farmers/${id}`);
  }

  /**
   * Create new farmer profile
   */
  async createFarmer(
    farmerData: Partial<FarmerProfile>,
  ): Promise<ApiResponse<FarmerProfile>> {
    return this.post<FarmerProfile>("/farmers", farmerData);
  }

  /**
   * Update farmer profile
   */
  async updateFarmer(
    id: string,
    updates: Partial<FarmerProfile>,
  ): Promise<ApiResponse<FarmerProfile>> {
    return this.put<FarmerProfile>(`/farmers/${id}`, updates);
  }

  // ===================
  // ANALYTICS APIs
  // ===================

  /**
   * Get dashboard analytics
   */
  async getDashboardAnalytics(): Promise<
    ApiResponse<{
      totalProduction: number;
      averagePrice: number;
      priceChange: number;
      regionStats: any[];
    }>
  > {
    return this.get("/analytics/dashboard");
  }

  /**
   * Get regional statistics
   */
  async getRegionalStats(regionId?: string): Promise<ApiResponse<any[]>> {
    const endpoint = regionId
      ? `/analytics/regions/${regionId}`
      : "/analytics/regions";
    return this.get(endpoint);
  }

  // ===================
  // MARKET DATA APIs
  // ===================

  /**
   * Get market prices
   */
  async getMarketPrices(): Promise<ApiResponse<any[]>> {
    return this.get("/market/prices");
  }

  /**
   * Get price history for a product
   */
  async getPriceHistory(productId: string): Promise<ApiResponse<any[]>> {
    return this.get(`/market/prices/${productId}/history`);
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing or custom instances
export { ApiClient };

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("agroconnect-auth-token");
};

// Helper function to get current user from localStorage
export const getCurrentUserFromCache = (): UserProfile | null => {
  const userData = localStorage.getItem("agroconnect-user-profile");
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
  return null;
};
