import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/layout/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
// import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import { regions } from "@/lib/agricultural-data";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Building,
  Calendar,
  Trash2,
  Star,
  TrendingUp,
  BarChart3,
  Shield,
  Leaf,
  Activity,
  Zap,
  Target,
  Edit,
  Save,
  Check,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Base_Url } from "@/App";
import userStore from "@/store/UserStore";
import { shallow } from "zustand/shallow";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { actualTheme } = useTheme();
  const user = userStore((state) => state.user);
  const token = userStore((state) => state.token);
  const navigate = useNavigate();
  // Simple state management for profile editing
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslation();

  type Activity = {
    id: number;
    action: "CREATE" | "UPDATE" | "DELETE";
    action_display: string;
    model_name: string;
    object_name: string;
    timestamp: string;
    time_ago: string;
  };

  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch(`${Base_Url}/accounts/recent-activities/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.activities)) {
          setActivities(data.activities);
        } else {
          console.error("Invalid activity format", data);
          setActivities([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch activities:", err);
        setActivities([]);
      });
  }, [token]);

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await axios.delete(`${Base_Url}/accounts/delete/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        alert("Your account has been deleted successfully.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/register"); // Redirect explicitly to register/login page
      }
    } catch (error: any) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };
  // Load profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        console.log("Current token:", token);
        if (!user?.email || !token) {
          throw new Error("No user or token available from store");
        }
        const response = await fetch(`${Base_Url}/accounts/profile/`, {
          // corrected URL explicitly
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // correct JWT token explicitly
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const profileData = await response.json(); // directly assign profile data
        setProfile(profileData); // clearly fixed this step
      } catch (error) {
        setError("Failed to fetch profile data");
        console.log("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user, token]);

  const startEditing = () => {
    setIsEditing(true);
    setSaveStatus("idle");
    setError(null);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSaveStatus("idle");
    setError(null);
  };

  const updateProfile = async (updates: any) => {
    setIsSaving(true);
    setSaveStatus("saving");
    setError(null);

    try {
      const response = await fetch(`${Base_Url}/accounts/profile/`, {
        method: "PUT", // ✅ Correct method explicitly set
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Auth token explicitly included
        },
        body: JSON.stringify(updates), // ✅ send updated profile data explicitly
      });

      if (!response.ok) {
        throw new Error("Failed to save profile data");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setSaveStatus("success");
      setIsEditing(false);

      // Optional: clear success message after a short delay
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save profile");
      setSaveStatus("error");
      setTimeout(() => {
        setSaveStatus("idle");
        setError(null);
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Local form state for editing
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    phone_number: "",
    role: "",
    region: "",
    last_name: "",
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        role: profile.role || "",
        region: profile.region || "",
        last_name: profile.last_name || "",
      });
    }
  }, [profile]);

  // Update form data when editing starts
  useEffect(() => {
    if (profile && isEditing) {
      setFormData({
        first_name: profile.first_name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        role: profile.role || "",
        region: profile.region || "",
        last_name: profile.last_name || "",
      });
    }
  }, [profile, isEditing]);

  const handleEdit = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        role: profile.role || "",
        region: profile.region || "",
        last_name: profile.last_name || "",
      });
      startEditing();
    }
  };

  const handleSave = async () => {
    if (formData.email !== profile.email) {
      try {
        const response = await fetch(
          `${Base_Url}/accounts/profile/request-email-change/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_id: profile.id, // ✅ explicitly included user ID here
              new_email: formData.email,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to initiate email change");
        }

        navigate("/profile/change-email", {
          state: { newEmail: formData.email, userId: profile.id },
        }); // explicitly pass userId as well
      } catch (error) {
        console.error("Error initiating email change:", error);
        setError("Failed to send verification code to new email.");
      }
    } else {
      await updateProfile(formData);
    }
  };

  const handleCancel = () => {
    cancelEditing();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      Farmers: { label: "Farmer", color: "bg-green-500 text-white border-0" },
      Exporters: {
        label: "Exporter",
        color: "bg-blue-500 text-white border-0",
      },
      Analysts: {
        label: "Market Analyst",
        color: "bg-purple-500 text-white border-0",
      },
    };
    return roleConfig[role as keyof typeof roleConfig] || roleConfig.Farmers;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "min-h-screen transition-colors duration-300 flex items-center justify-center",
          actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
        )}
      >
        <Sidebar />
        <div className="flex-1 md:mr-80 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
            <p
              className={cn(
                "text-lg",
                actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
              )}
            >
              Loading your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if profile failed to load
  if (!profile) {
    return (
      <div
        className={cn(
          "min-h-screen transition-colors duration-300",
          actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
        )}
      >
        <Sidebar />
        <div className="flex-1 md:mr-80">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Card
              className={cn(
                "text-center py-12",
                actualTheme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200",
              )}
            >
              <CardContent>
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3
                  className={cn(
                    "text-xl font-bold mb-2",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  Failed to Load Profile
                </h3>
                <p
                  className={cn(
                    "mb-4",
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  {error ||
                    "Unable to load your profile information. Please try again."}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const region = regions.find((r) => r.id === profile.region);

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
      )}
    >
      <Sidebar />

      <div className="flex-1 md:mr-80">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Profile Header */}
          <Card
            className={cn(
              "mb-8",
              actualTheme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200",
            )}
          >
            <CardContent className="pt-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full blur opacity-50"></div>
                  <Avatar
                    className={cn(
                      "relative w-32 h-32 border-4",
                      actualTheme === "dark"
                        ? "border-gray-600"
                        : "border-gray-200",
                    )}
                  >
                    <AvatarImage
                      src={profile.avatar || "/placeholder-user.jpg"}
                    />
                    <AvatarFallback className="text-2xl bg-green-500 text-white font-bold">
                      {profile.first_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <h1
                        className={cn(
                          "text-4xl font-bold mb-3",
                          actualTheme === "dark"
                            ? "text-white"
                            : "text-gray-900",
                        )}
                      >
                        {profile.first_name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge className={getRoleBadge(profile.role).color}>
                          <Leaf className="h-3 w-3 mr-1" />
                          {getRoleBadge(profile.role).label}
                        </Badge>
                        {profile.verified && (
                          <Badge className="bg-green-500 text-white border-0">
                            <Shield className="h-3 w-3 mr-1" />
                            {t("verified")}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <p
                          className={cn(
                            "font-bold text-xl",
                            actualTheme === "dark"
                              ? "text-white"
                              : "text-gray-900",
                          )}
                        >
                          {profile.completedTransactions}
                        </p>
                        <p className="text-green-500 text-sm">{t("transactions")}</p>
                      </div>
                      <div className="text-center">
                        <p
                          className={cn(
                            "font-bold text-xl",
                            actualTheme === "dark"
                              ? "text-white"
                              : "text-gray-900",
                          )}
                        >
                          {profile.totalVolume}t
                        </p>
                        <p className="text-green-500 text-sm">{t("total_volume")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6">
                    <div
                      className={cn(
                        "relative group flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-110",
                        actualTheme === "dark"
                          ? "bg-green-600/20 hover:bg-green-600/30"
                          : "bg-green-500/20 hover:bg-green-500/30",
                      )}
                      title={profile.email}
                    >
                      <Mail className="h-5 w-5 text-green-500" />
                      <div
                        className={cn(
                          "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50",
                          actualTheme === "dark"
                            ? "bg-gray-800 text-white border border-gray-700"
                            : "bg-gray-900 text-white",
                        )}
                      >
                        {profile.email}
                        <div
                          className={cn(
                            "absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent",
                            actualTheme === "dark"
                              ? "border-t-gray-800"
                              : "border-t-gray-900",
                          )}
                        />
                      </div>
                    </div>
                    <div
                      className={cn(
                        "relative group flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-110",
                        actualTheme === "dark"
                          ? "bg-green-600/20 hover:bg-green-600/30"
                          : "bg-green-500/20 hover:bg-green-500/30",
                      )}
                      title={profile.phone_number}
                    >
                      <Phone className="h-5 w-5 text-green-500" />
                      <div
                        className={cn(
                          "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50",
                          actualTheme === "dark"
                            ? "bg-gray-800 text-white border border-gray-700"
                            : "bg-gray-900 text-white",
                        )}
                      >
                        {profile.phone_number}
                        <div
                          className={cn(
                            "absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent",
                            actualTheme === "dark"
                              ? "border-t-gray-800"
                              
                              : "border-t-gray-900",
                          )}
                        />
                      </div>
                    </div>
                    <div
                      className={cn(
                        "relative group flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-110",
                        actualTheme === "dark"
                          ? "bg-green-600/20 hover:bg-green-600/30"
                          : "bg-green-500/20 hover:bg-green-500/30",
                      )}
                      title={region?.name}
                    >
                      <MapPin className="h-5 w-5 text-green-500" />
                      <div
                        className={cn(
                          "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50",
                          actualTheme === "dark"
                            ? "bg-gray-800 text-white border border-gray-700"
                            : "bg-gray-900 text-white",
                        )}
                      >
                        {region?.name}
                        <div
                          className={cn(
                            "absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent",
                            actualTheme === "dark"
                              ? "border-t-gray-800"
                              : "border-t-gray-900",
                          )}
                        />
                      </div>
                    </div>
                    <div
                      className={cn(
                        "relative group flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-110",
                        actualTheme === "dark"
                          ? "bg-green-600/20 hover:bg-green-600/30"
                          : "bg-green-500/20 hover:bg-green-500/30",
                      )}
                      title={`Joined ${new Date(profile.date_joined).toLocaleDateString()}`}
                    >
                      <Calendar className="h-5 w-5 text-green-500" />
                      <div
                        className={cn(
                          "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50",
                          actualTheme === "dark"
                            ? "bg-gray-800 text-white border border-gray-700"
                            : "bg-gray-900 text-white",
                        )}
                      >
                        {t("joined")} {new Date(profile.date_joined).toLocaleDateString()}
                        <div
                          className={cn(
                            "absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent",
                            actualTheme === "dark"
                              ? "border-t-gray-800"
                              : "border-t-gray-900",
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="personal" className="space-y-8">
            <TabsList
              className={cn(
                "grid w-full grid-cols-4",
                actualTheme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200",
              )}
            >
              <TabsTrigger
                value="personal"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <User className="h-4 w-4 mr-2" />
                {t("personal_info")}
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <Activity className="h-4 w-4 mr-2" />
                {t("activity")}
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {t("analytics")}
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <Target className="h-4 w-4 mr-2" />
                {t("settings")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-8">
              <Card
                className={cn(
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle
                    className={cn(
                      "text-2xl flex items-center",
                      actualTheme === "dark" ? "text-white" : "text-gray-900",
                    )}
                  >
                    <img
                      src="/AgroConnect 2.png"
                      alt="Logo"
                      className="w-8 h-8 mr-3"
                    />
                    {/* <Leaf className="h-6 w-6 mr-2 text-green-500" /> */}
                    {t("personal_inform")}
                    {saveStatus === "success" && (
                      <Badge className="ml-3 bg-green-500 text-white border-0">
                        <Check className="h-3 w-3 mr-1" />
                        {t("save_success")}
                      </Badge>
                    )}
                    {saveStatus === "error" && (
                      <Badge className="ml-3 bg-red-500 text-white border-0">
                        <X className="h-3 w-3 mr-1" />
                        {error || "Save Failed"}
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex space-x-2">
                    {isEditing && (
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className={cn(
                          actualTheme === "dark"
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50",
                        )}
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4 mr-2" />
                        {t("cancel")}
                      </Button>
                    )}
                    <Button
                      onClick={isEditing ? handleSave : handleEdit}
                      className="bg-green-500 hover:bg-green-600 text-white"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t("save")}...
                        </>
                      ) : isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {t("save_changes")}
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          {t("edit_profile")}
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label
                        htmlFor="first_name"
                        className={cn(
                          "font-medium",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700",
                        )}
                      >
                        {t("first_name")}
                      </Label>
                      <Input
                        id="first_name"
                        value={
                          isEditing ? formData.first_name : profile.first_name
                        }
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleInputChange("first_name", e.target.value)
                        }
                        className={cn(
                          "focus:ring-green-500 focus:border-green-500",
                          actualTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-700/50 disabled:text-gray-400"
                            : "bg-white border-gray-300 disabled:bg-gray-50 disabled:text-gray-500",
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="last_name"
                        className={cn(
                          "font-medium",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700",
                        )}
                      >
                        {t("last_name")}
                      </Label>
                      <Input
                        id="last_name"
                        value={
                          isEditing ? formData.last_name : profile.last_name
                        }
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleInputChange("last_name", e.target.value)
                        }
                        className={cn(
                          "focus:ring-green-500 focus:border-green-500",
                          actualTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-700/50 disabled:text-gray-400"
                            : "bg-white border-gray-300 disabled:bg-gray-50 disabled:text-gray-500",
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className={cn(
                          "font-medium",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700",
                        )}
                      >
                        {t("email")}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={isEditing ? formData.email : profile.email}
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={cn(
                          "focus:ring-green-500 focus:border-green-500",
                          actualTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-700/50 disabled:text-gray-400"
                            : "bg-white border-gray-300 disabled:bg-gray-50 disabled:text-gray-500",
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone_number"
                        className={cn(
                          "font-medium",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700",
                        )}
                      >
                        {t("phone_number")}
                      </Label>
                      <Input
                        id="phone_number"
                        value={
                          isEditing
                            ? formData.phone_number
                            : profile.phone_number
                        }
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleInputChange("phone_number", e.target.value)
                        }
                        className={cn(
                          "focus:ring-green-500 focus:border-green-500",
                          actualTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-700/50 disabled:text-gray-400"
                            : "bg-white border-gray-300 disabled:bg-gray-50 disabled:text-gray-500",
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="region"
                        className={cn(
                          "font-medium",
                          actualTheme === "dark"
                            ? "text-gray-300"
                            : "text-gray-700",
                        )}
                      >
                        {t("region")}
                      </Label>
                      <Select
                        value={isEditing ? formData.region : profile.region}
                        disabled={!isEditing}
                        onValueChange={(value) =>
                          handleInputChange("region", value)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "focus:ring-green-500 focus:border-green-500",
                            actualTheme === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300",
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region.id} value={region.id}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-8">
              <Card
                className={cn(
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "text-2xl flex items-center",
                      actualTheme === "dark" ? "text-white" : "text-gray-900",
                    )}
                  >
                    <Activity className="h-6 w-6 mr-2 text-green-500" />
                    {t("recent_activity")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {activities.length > 0 ? (
                      activities.map((activity) => (
                        <div
                          key={activity.id}
                          className={cn(
                            "flex items-center justify-between py-4 border-b last:border-b-0",
                            actualTheme === "dark"
                              ? "border-gray-700"
                              : "border-gray-200",
                          )}
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                activity.action === "CREATE"
                                  ? "bg-green-500"
                                  : activity.action === "UPDATE"
                                    ? "bg-blue-500"
                                    : "bg-red-500"
                              }`}
                            />
                            <div>
                              <p
                                className={cn(
                                  "font-medium",
                                  actualTheme === "dark"
                                    ? "text-white"
                                    : "text-gray-900",
                                )}
                              >
                                {activity.action_display}
                              </p>
                              <p
                                className={cn(
                                  "text-sm",
                                  actualTheme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-600",
                                )}
                              >
                                {activity.object_name}
                              </p>
                            </div>
                          </div>
                          <span
                            className={cn(
                              "text-sm",
                              actualTheme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500",
                            )}
                          >
                            {activity.time_ago}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-center text-gray-500">
                        {t("no_recent_activity")}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                  className={cn(
                    actualTheme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200",
                  )}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle
                      className={cn(
                        "text-sm font-medium",
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-600",
                      )}
                    >
                      {t("total_transact")}
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={cn(
                        "text-3xl font-bold",
                        actualTheme === "dark" ? "text-white" : "text-gray-900",
                      )}
                    >
                      {profile.completedTransactions}
                    </div>
                    <p className="text-xs text-green-500">
                      +18% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    actualTheme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200",
                  )}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle
                      className={cn(
                        "text-sm font-medium",
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-600",
                      )}
                    >
                      Volume Traded
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={cn(
                        "text-3xl font-bold",
                        actualTheme === "dark" ? "text-white" : "text-gray-900",
                      )}
                    >
                      {profile.totalVolume}t
                    </div>
                    <p className="text-xs text-green-500">
                      +12% efficiency gain
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    actualTheme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200",
                  )}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle
                      className={cn(
                        "text-sm font-medium",
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-600",
                      )}
                    >
                      Cultivated Area
                    </CardTitle>
                    <Leaf className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={cn(
                        "text-3xl font-bold",
                        actualTheme === "dark" ? "text-white" : "text-gray-900",
                      )}
                    >
                      185ha
                    </div>
                    <p className="text-xs text-green-500">+8% area expansion</p>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    actualTheme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200",
                  )}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle
                      className={cn(
                        "text-sm font-medium",
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-600",
                      )}
                    >
                      Success Rate
                    </CardTitle>
                    <Star className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={cn(
                        "text-3xl font-bold",
                        actualTheme === "dark" ? "text-white" : "text-gray-900",
                      )}
                    >
                      96%
                    </div>
                    <p className="text-xs text-green-500">+4% improvement</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
              <Card
                className={cn(
                  actualTheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "text-2xl flex items-center",
                      actualTheme === "dark" ? "text-white" : "text-gray-900",
                    )}
                  >
                    <Target className="h-6 w-6 mr-2 text-green-500" />
                    {t("account_sets")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3
                      className={cn(
                        "text-xl font-semibold mb-6",
                        actualTheme === "dark"
                          ? "text-gray-200"
                          : "text-gray-800",
                      )}
                    >
                      {t("not_prefs")}
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          label: "Email notifications for transactions",
                          checked: true,
                        },
                        {
                          label: "SMS alerts for price changes",
                          checked: false,
                        },
                        { label: "Weekly market reports", checked: true },
                        { label: "Transaction reminders", checked: true },
                      ].map((setting, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-lg border",
                            actualTheme === "dark"
                              ? "bg-gray-700/50 border-gray-600"
                              : "bg-gray-50 border-gray-200",
                          )}
                        >
                          <span
                            className={cn(
                              actualTheme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700",
                            )}
                          >
                            {setting.label}
                          </span>
                          <input
                            type="checkbox"
                            defaultChecked={setting.checked}
                            className="rounded bg-gray-700 border-gray-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3
                      className={cn(
                        "text-xl font-semibold mb-6",
                        actualTheme === "dark"
                          ? "text-gray-200"
                          : "text-gray-800",
                      )}
                    >
                      {t("security_options")}
                    </h3>
                    <div className="space-y-4">
                      <Button
                        className={cn(
                          "w-full justify-start",
                          actualTheme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                            : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300",
                        )}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {t("change_password")}
                      </Button>
                      <Button
                        className={cn(
                          "w-full justify-start",
                          actualTheme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                            : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300",
                        )}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        {t("two_fac_auth")}
                      </Button>
                      <Button
                        className={cn(
                          "w-full justify-start",
                          actualTheme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                            : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300",
                        )}
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        {t("down_acc_data")}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-red-500">
                    {t("danger_z")}
                    </h3>
                    <Button
  variant="destructive"
  className="bg-red-600 hover:bg-red-700 text-white"
  onClick={handleDeleteAccount}
  disabled={isDeleting}
>
  <Trash2 className="h-4 w-4 mr-2" />
  {isDeleting ? "Deleting..." : "Delete Account"}
</Button>
                    <p
                      className={cn(
                        "text-sm mt-3",
                        actualTheme === "dark"
                          ? "text-gray-400"
                          : "text-gray-500",
                      )}                   
                    >{t("action")}
                    
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
