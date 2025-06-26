import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"; 
import axios from "axios";
import { Base_Url } from "@/App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const ForgotPasswordNewPassword = () => {
  const { actualTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Get uid and token from location state. Crucial for the API call.
  const uid = location.state?.uid || "";
  const token = location.state?.token || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    // If uid or token are missing, redirect back to the start of the flow
    if (!uid || !token) {
      showToastMessage("Session expired or invalid. Please restart the password reset process.", "error");
      navigate("/login/forgot-password");
    }
  }, [uid, token, navigate]);

  const showToastMessage = (message: string, type: "success" | "error") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      showToastMessage("Passwords do not match.", "error");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 4) { // Example: enforce minimum password length
        setError("Password must be at least 4 characters long.");
        showToastMessage("Password must be at least 4 characters long.", "error");
        setIsLoading(false);
        return;
    }

    try {
      // API call to set the new password
      const response = await axios.post(`${Base_Url}/accounts/password-reset/confirm/`, {
        uid, // Django's uid for the user
        token, // Django's token for password reset
        new_password: newPassword,
        re_new_password: confirmPassword, // Assuming your backend expects this
      });

      console.log("Password reset successful:", response.data);
      showToastMessage("Your password has been successfully reset!", "success");

      // Redirect to login page after successful password reset
      navigate("/login");
    } catch (err: any) {
      setIsLoading(false);
      console.error("New password set error:", err);

      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const errorData = err.response.data;

        if (status === 400) {
          if (errorData.new_password) {
            setError(errorData.new_password[0]);
          } else if (errorData.detail) {
            setError(errorData.detail);
          } else {
            setError("Failed to set new password. Please check your inputs.");
          }
        } else if (status === 403) { // Often for invalid uid/token
             setError("Invalid or expired reset link. Please restart the process.");
        } else {
          setError(`API Error: ${status} - ${errorData.detail || err.message}`);
        }
        showToastMessage(error || "Failed to set new password.", "error");
      } else {
        setError(err.message || "Network error occurred.");
        showToastMessage("Failed to set new password due to network error.", "error");
      }
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-4 transition-colors duration-300",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
      )}
    >
      <div className="w-full max-w-md">
        {/* Header */}
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
                  actualTheme === "dark" ? "text-white" : "text-gray-900",
                )}
              >
                AgroConnect
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  actualTheme === "dark" ? "text-gray-400" : "text-gray-600",
                )}
              >
                {t("agri_platform")}
              </span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <Card
          className={cn(
            "shadow-xl",
            actualTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <CardHeader className="space-y-1">
            <CardTitle
              className={cn(
                "text-3xl font-bold text-center",
                actualTheme === "dark" ? "text-white" : "text-gray-900",
              )}
            >
              {t("setn_pass")}
            </CardTitle>
            <p
              className={cn(
                "text-center",
                actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
              )}
            >
              {t("en_newp")}
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert
                className={cn(
                  "mb-6",
                  actualTheme === "dark"
                    ? "bg-red-900/20 border-red-800/50 text-red-300"
                    : "bg-red-50 border-red-200 text-red-600",
                )}
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="new-password"
                  className={cn(
                    "font-medium",
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  {t("new_pass")}
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={cn(
                      "focus:ring-green-500 focus:border-green-500 pr-12",
                      actualTheme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300",
                    )}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                      actualTheme === "dark"
                        ? "text-gray-400 hover:text-green-400"
                        : "text-gray-500 hover:text-green-600",
                    )}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className={cn(
                    "font-medium",
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  {t("con_newp")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn(
                      "focus:ring-green-500 focus:border-green-500 pr-12",
                      actualTheme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300",
                    )}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                      actualTheme === "dark"
                        ? "text-gray-400 hover:text-green-400"
                        : "text-gray-500 hover:text-green-600",
                    )}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg shadow-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t("setting_pass")}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Lock className="h-4 w-4 mr-2" />
                    {t("reset_pass")}
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-green-500 hover:text-green-600 font-medium transition-colors"
              >
                {t("back_log")}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p
            className={cn(
              "text-sm",
              actualTheme === "dark" ? "text-gray-400" : "text-gray-500",
            )}
          >
            &copy; {t("rights")}
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordNewPassword;
