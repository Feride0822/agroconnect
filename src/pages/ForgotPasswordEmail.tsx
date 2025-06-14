import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Mail, Loader2, AlertCircle } from "lucide-react"; // Added Mail icon
import axios from "axios";
import { Base_Url } from "@/App"; // Ensure Base_Url is imported
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordEmail = () => {
  const { actualTheme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

    try {
      const response = await axios.post(
        `${Base_Url}/accounts/password-reset/request/`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Only if backend uses cookies
        },
      );

      //   // API call to request password reset code
      //   const response = await axios.post(`${Base_Url}/accounts/password-reset/request/`, {
      //     email,
      //   });

      console.log("Password reset request successful:", response.data);
      showToastMessage(
        "A 4-digit code has been sent to your email.",
        "success",
      );

      sessionStorage.setItem("reset_email", email);
      navigate("/login/forgot-password/verify-code", { state: { email } });
    } catch (err: any) {
      setIsLoading(false);
      console.error("Forgot password request error:", err);
      console.error("Backend error data:", err.response?.data);

      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const errorData = err.response.data;

        if (status === 400 && errorData.email) {
          setError(errorData.email[0]); // Specific error for email field
        } else if (errorData.detail) {
          setError(errorData.detail);
        } else {
          setError("Failed to send reset code. Please try again.");
        }
        showToastMessage(error || "Failed to send reset code.", "error");
      } else {
        setError(err.message || "Network error occurred.");
        showToastMessage(
          "Failed to send reset code due to network error.",
          "error",
        );
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
                Agricultural Platform
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
              Forgot Password
            </CardTitle>
            <p
              className={cn(
                "text-center",
                actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
              )}
            >
              Enter your email to receive a password reset code.
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
                  htmlFor="email"
                  className={cn(
                    "font-medium",
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "focus:ring-green-500 focus:border-green-500",
                    actualTheme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      : "bg-white border-gray-300",
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
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending Code...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reset Code
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-green-500 hover:text-green-600 font-medium transition-colors"
              >
                Back to Login
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
            &copy; 2025 AgroConnect. All rights reserved.
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordEmail;
