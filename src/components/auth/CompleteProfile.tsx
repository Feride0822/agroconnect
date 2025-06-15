import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Sidebar from "@/components/layout/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { AlertCircle, Sprout, Users } from "lucide-react";
import { regions } from "@/lib/agricultural-data";
import axios from "axios";
import { Base_Url } from "@/App";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";
import userStore from "@/store/UserStore";


const CompleteProfile = () => {
  const { actualTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    role: "",
    region: "",
    phone_number: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  
  const [searchParams] = useSearchParams();

useEffect(() => {
  const emailParam = searchParams.get('email');
  const access_token = searchParams.get('access_token');
  const refresh_token = searchParams.get('refresh_token');

  if (!emailParam || !access_token || !refresh_token) {
    navigate("/register");
    return;
  }

  setEmail(emailParam);
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
}, [searchParams, navigate]);



  const showToastMessage = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "success"
  ) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: actualTheme === "dark" ? "dark" : "light",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.role || !formData.region || !formData.phone_number) {
      setError("Please fill in all required fields (Role, Region, Phone).");
      showToastMessage("Please fill in all required fields.", "error");
      return false;
    }

    const phoneRegex = /^\+?\d{9,15}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      setError("Please enter a valid phone number (9-15 digits, optional +).");
      showToastMessage(
        "Please enter a valid phone number (9-15 digits, optional +).",
        "error"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      // Update the user profile with additional information
      const updateEndpoint = `${Base_Url}/accounts/login/google/complete-profile/`;

      const res = await axios.post(updateEndpoint, {
        email: email,
        role: formData.role,
        region: formData.region,
        phone_number: formData.phone_number,
      });

      console.log("Profile completion successful:", res.data);
      showToastMessage("Profile completed successfully! You can now log in.", "success");

      setTimeout(async () => {
  try {
    // Fetch user details explicitly after completing the profile
    const access_token = localStorage.getItem("access_token");
    const response = await axios.get(`${Base_Url}/accounts/profile/`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = response.data;

    // Store user details explicitly in Zustand store or context
    userStore.getState().login(user, access_token!);

    // Navigate explicitly based on user role
    if (user.role === "Farmers") {
      navigate("/statistics");
    } else if (user.role === "Exporters") {
      navigate("/farmers");
    } else if (user.role === "Analysts") {
      navigate("/dashboard");
    } else {
      navigate("/dashboard"); // default fallback
    }
  } catch (error) {
    console.log("Failed to fetch user details after profile completion:");
    navigate("/login", { state: { message: "Authentication failed, please login again." } });
  }
}, 1000);


    } catch (err: any) {
      console.error("Profile completion error:", err);
      setIsLoading(false);

      if (axios.isAxiosError(err) && err.response) {
        let errorMessage = "Profile completion failed. Please try again.";

        if (err.response.data) {
          if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data.detail) {
            errorMessage = err.response.data.detail;
          } else if (err.response.data.non_field_errors && Array.isArray(err.response.data.non_field_errors)) {
            errorMessage = err.response.data.non_field_errors.join(", ");
          }
        }

        setError(errorMessage);
        showToastMessage(`Profile completion failed: ${errorMessage}`, "error");
      } else {
        setError(err.message || "An unexpected error occurred. Check your network.");
        showToastMessage("An unexpected error occurred. Please check your network connection.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50"
      )}
    >
      <Sidebar />
      <div className="flex-1 md:mr-80 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center w-16 h-16 bg-green-500 rounded-xl">
                  <img src="/AgroConnect 3.png" alt="Logo" />
                </div>
              </div>
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-3xl font-bold",
                    actualTheme === "dark" ? "text-white" : "text-gray-900"
                  )}
                >
                  AgroConnect
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    actualTheme === "dark" ? "text-gray-400" : "text-gray-600"
                  )}
                >
                  Agricultural Platform
                </span>
              </div>
            </Link>
            <p
              className={cn(
                "mt-4 text-lg",
                actualTheme === "dark" ? "text-gray-300" : "text-gray-600"
              )}
            >
              Complete your profile to get started
            </p>
          </div>

          {/* Complete Profile Form */}
          <Card
            className={cn(
              "shadow-xl",
              actualTheme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            )}
          >
            <CardHeader className="space-y-1">
              <CardTitle
                className={cn(
                  "text-2xl font-bold text-center",
                  actualTheme === "dark" ? "text-white" : "text-gray-900"
                )}
              >
                Complete Your Profile
              </CardTitle>
              <p
                className={cn(
                  "text-center text-sm",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-600"
                )}
              >
                Welcome {email}! Please provide additional information.
              </p>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert
                  className={cn(
                    "mb-6",
                    actualTheme === "dark"
                      ? "bg-red-900/20 border-red-800/50 text-red-300"
                      : "bg-red-50 border-red-200 text-red-600"
                  )}
                >
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label
                    htmlFor="role"
                    className={cn(
                      "font-medium",
                      actualTheme === "dark" ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    Role *
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleSelectChange("role", value)}
                    required
                  >
                    <SelectTrigger
                      className={cn(
                        "focus:ring-green-500 focus:border-green-500",
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      )}
                    >
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Farmers">Farmer</SelectItem>
                      <SelectItem value="Exporters">Exporter</SelectItem>
                      <SelectItem value="Analysts">Market Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Region */}
                <div className="space-y-2">
                  <Label
                    htmlFor="region"
                    className={cn(
                      "font-medium",
                      actualTheme === "dark" ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    Region *
                  </Label>
                  <Select
                    value={formData.region}
                    onValueChange={(value) => handleSelectChange("region", value)}
                    required
                  >
                    <SelectTrigger
                      className={cn(
                        "focus:ring-green-500 focus:border-green-500",
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      )}
                    >
                      <SelectValue placeholder="Select your region" />
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

                {/* Phone */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phone_number"
                    className={cn(
                      "font-medium",
                      actualTheme === "dark" ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="+998 XX XXX XX XX"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange("phone_number", e.target.value)}
                    className={cn(
                      "focus:ring-green-500 focus:border-green-500",
                      actualTheme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300"
                    )}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg shadow-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Completing Profile...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Complete Profile
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p
                  className={cn(
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  Need help?{" "}
                  <Link
                    to="/login"
                    className="text-green-500 hover:text-green-600 font-medium transition-colors"
                  >
                    Back to Login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p
              className={cn(
                "text-sm",
                actualTheme === "dark" ? "text-gray-400" : "text-gray-500"
              )}
            >
              &copy; 2025 AgroConnect. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CompleteProfile;
