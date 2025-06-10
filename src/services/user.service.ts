/**
 * User Service
 *
 * High-level service functions for user-related operations.
 * This layer provides a clean interface between components and the API client.
 */

import {
  apiClient,
  type UserProfile,
  type UpdateProfileRequest,
} from "@/lib/api-client";

export class UserService {
  /**
   * Get current user profile with fallback to localStorage
   */
  static async getCurrentProfile(): Promise<UserProfile | null> {
    try {
      const response = await apiClient.getCurrentUser();

      if (response.success && response.data) {
        // Cache the profile data locally
        localStorage.setItem(
          "agroconnect-user-profile",
          JSON.stringify(response.data),
        );
        return response.data;
      }

      // Fallback to localStorage if API fails
      const cachedData = localStorage.getItem("agroconnect-user-profile");
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);

      // Return cached data as fallback
      const cachedData = localStorage.getItem("agroconnect-user-profile");
      if (cachedData) {
        try {
          return JSON.parse(cachedData);
        } catch {
          return null;
        }
      }

      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: UpdateProfileRequest): Promise<{
    success: boolean;
    data?: UserProfile;
    error?: string;
  }> {
    try {
      const response = await apiClient.updateProfile(updates);

      if (response.success && response.data) {
        // Update localStorage cache
        localStorage.setItem(
          "agroconnect-user-profile",
          JSON.stringify(response.data),
        );

        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: response.error || "Failed to update profile",
      };
    } catch (error) {
      console.error("Error updating profile:", error);

      // For development/offline mode, save to localStorage only
      if (import.meta.env.VITE_ENABLE_MOCK_API === "true") {
        const cachedData = localStorage.getItem("agroconnect-user-profile");
        if (cachedData) {
          const currentProfile = JSON.parse(cachedData);
          const updatedProfile = { ...currentProfile, ...updates };
          localStorage.setItem(
            "agroconnect-user-profile",
            JSON.stringify(updatedProfile),
          );

          return {
            success: true,
            data: updatedProfile,
          };
        }
      }

      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(file: File): Promise<{
    success: boolean;
    avatarUrl?: string;
    error?: string;
  }> {
    try {
      const response = await apiClient.uploadAvatar(file);

      if (response.success && response.data) {
        // Update the cached profile with new avatar URL
        const cachedData = localStorage.getItem("agroconnect-user-profile");
        if (cachedData) {
          const profile = JSON.parse(cachedData);
          profile.avatar = response.data.avatarUrl;
          localStorage.setItem(
            "agroconnect-user-profile",
            JSON.stringify(profile),
          );
        }

        return {
          success: true,
          avatarUrl: response.data.avatarUrl,
        };
      }

      return {
        success: false,
        error: response.error || "Failed to upload avatar",
      };
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Check if user profile is complete
   */
  static isProfileComplete(profile: UserProfile): boolean {
    const requiredFields = ["name", "email", "phone", "role", "region"];
    return requiredFields.every((field) => profile[field as keyof UserProfile]);
  }

  /**
   * Get profile completion percentage
   */
  static getProfileCompletionPercentage(profile: UserProfile): number {
    const allFields = [
      "name",
      "email",
      "phone",
      "role",
      "region",
      "organization",
      "avatar",
    ];
    const completedFields = allFields.filter(
      (field) => profile[field as keyof UserProfile],
    );

    return Math.round((completedFields.length / allFields.length) * 100);
  }
}

export default UserService;
