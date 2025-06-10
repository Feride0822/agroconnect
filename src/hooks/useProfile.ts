/**
 * useProfile Hook
 *
 * React hook for managing user profile data with automatic sync
 * between API, localStorage, and component state.
 */

import { useState, useEffect, useCallback } from "react";
import UserService from "@/services/user.service";
import type { UserProfile, UpdateProfileRequest } from "@/lib/api-client";

interface UseProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  isEditing: boolean;
  isSaving: boolean;
  saveStatus: "idle" | "saving" | "success" | "error";
  error: string | null;
  startEditing: () => void;
  cancelEditing: () => void;
  updateProfile: (updates: UpdateProfileRequest) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(
    null,
  );

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const profileData = await UserService.getCurrentProfile();

      if (profileData) {
        setProfile(profileData);
        setOriginalProfile(profileData);
      } else {
        setError("Failed to load profile");
      }
    } catch (err) {
      setError("Network error while loading profile");
      console.error("Error loading profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startEditing = useCallback(() => {
    if (profile) {
      setOriginalProfile({ ...profile });
      setIsEditing(true);
      setSaveStatus("idle");
      setError(null);
    }
  }, [profile]);

  const cancelEditing = useCallback(() => {
    if (originalProfile) {
      setProfile({ ...originalProfile });
    }
    setIsEditing(false);
    setSaveStatus("idle");
    setError(null);
  }, [originalProfile]);

  const updateProfile = useCallback(
    async (updates: UpdateProfileRequest) => {
      if (!profile) return;

      try {
        setIsSaving(true);
        setSaveStatus("saving");
        setError(null);

        const result = await UserService.updateProfile(updates);

        if (result.success && result.data) {
          setProfile(result.data);
          setOriginalProfile(result.data);
          setSaveStatus("success");
          setIsEditing(false);

          // Auto-clear success status after 3 seconds
          setTimeout(() => {
            setSaveStatus("idle");
          }, 3000);
        } else {
          setError(result.error || "Failed to update profile");
          setSaveStatus("error");

          // Auto-clear error status after 5 seconds
          setTimeout(() => {
            setSaveStatus("idle");
            setError(null);
          }, 5000);
        }
      } catch (err) {
        const errorMessage = "Network error while updating profile";
        setError(errorMessage);
        setSaveStatus("error");
        console.error("Error updating profile:", err);

        // Auto-clear error status after 5 seconds
        setTimeout(() => {
          setSaveStatus("idle");
          setError(null);
        }, 5000);
      } finally {
        setIsSaving(false);
      }
    },
    [profile],
  );

  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    isEditing,
    isSaving,
    saveStatus,
    error,
    startEditing,
    cancelEditing,
    updateProfile,
    refreshProfile,
  };
}

export default useProfile;
