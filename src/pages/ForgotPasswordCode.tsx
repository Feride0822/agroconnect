import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Key, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import { Base_Url } from "@/App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const ForgotPasswordCode = () => {
  const { actualTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email;
  const emailFromSession = sessionStorage.getItem("reset_email");
  const email = emailFromState || emailFromSession || "";
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const { t } = useTranslation();
  const showToastMessage = (
    message: string,
    type: "success" | "error" | "info",
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

  useEffect(() => {
  console.log("emailFromState:", emailFromState);
  console.log("emailFromSession:", emailFromSession);
  
  if (!email) {
    showToastMessage("Session expired, please re-enter your email.", "error");
    sessionStorage.removeItem("reset_email"); // cleanup
    navigate("/login/forgot-password", { replace: true });
  }
}, [email, navigate]);


  useEffect(() => {
    if (!email) {
      showToastMessage("Please enter your email first.", "error");
      // Use replace to prevent going back to this page with empty email
      const timer = setTimeout(
        () => navigate("/login/forgot-password", { replace: true }),
        1000,
      );
      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (code.length !== 4) {
      const errorMessage = "Please enter a 4-digit code.";
      setError(errorMessage);
      showToastMessage(errorMessage, "error"); // Pass directly
      setIsLoading(false);
      return;
    }

    try {
      // API call to verify the 4-digit code
      const response = await axios.post(
        `${Base_Url}/accounts/password-reset/verify/`,
        {
          email,
          code,
        },
      );

      console.log("Code verification successful:", response.data);
      showToastMessage("Code verified successfully!", "success");

      const { uid, token } = response.data; // Adapt to your backend's response

      // Navigate to the new password page, passing uid and token
      navigate("/login/forgot-password/verify-code/new-password", {
        state: { uid, token },
      });
    } catch (err: any) {
      setIsLoading(false);
      console.error("Code verification error:", err);

      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const errorData = err.response.data;

        if (status === 400 && errorData.code) {
          setError(errorData.code[0]); // Specific error for code field
        } else if (errorData.detail) {
          setError(errorData.detail);
        } else {
          setError("Invalid or expired code. Please try again.");
        }
        showToastMessage(error || "Code verification failed.", "error");
      } else {
        setError(err.message || "Network error occurred.");
        showToastMessage(
          "Code verification failed due to network error.",
          "error",
        );
      }
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      showToastMessage("No email to resend code to.", "error");
      return;
    }
    if (resendCooldown > 0) {
      showToastMessage(
        `Please wait ${resendCooldown} seconds before resending.`,
        "info",
      );
      return;
    }

    setIsResending(true);
    setError(""); // Clear previous errors
    try {
      // API call to request a new code for the email
      await axios.post(`${Base_Url}/accounts/password-reset/`, { email }); // Assuming this is your resend endpoint
      showToastMessage("A new code has been sent to your email!", "success");
      setResendCooldown(60); // Set a 60-second cooldown
    } catch (err: any) {
      console.error("Resend code error:", err);
      let errorMessage = "Failed to resend code. Please try again.";
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.data &&
        err.response.data.detail
      ) {
        errorMessage = err.response.data.detail;
      }
      setError(errorMessage);
      showToastMessage(errorMessage, "error");
    } finally {
      setIsResending(false);
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
              Verify Code
            </CardTitle>
            <p
              className={cn(
                "text-center",
                actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
              )}
            >
              A 4-digit code has been sent to{" "}
              <span className="font-semibold text-green-400">{email}</span>.
              Please enter it below.
              <span className="text-red-700 font-semibold">Important! Don't forget to check spam!</span>
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
                  htmlFor="code"
                  className={cn(
                    "font-medium",
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Verification Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  pattern="\d{4}"
                  maxLength={4} // Limit to 4 characters
                  inputMode="numeric" // Optimize for numeric input on mobile
                  placeholder="Enter 4-digit code"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only digits and limit to 4 characters
                    if (/^\d*$/.test(value) && value.length <= 4) {
                      setCode(value);
                    }
                  }}
                  className={cn(
                    "focus:ring-green-500 focus:border-green-500 text-center text-xl tracking-widest",
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
                    Verifying Code...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Key className="h-4 w-4 mr-2" />
                    Verify Code
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={handleResendCode}
                disabled={isResending || resendCooldown > 0}
                className="text-green-500 hover:text-green-600 font-medium transition-colors p-0 h-auto"
              >
                {isResending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : resendCooldown > 0 ? (
                  `Resend Code (${resendCooldown}s)`
                ) : (
                  "Resend Code"
                )}
              </Button>{" "}
              <span
                className={cn(
                  actualTheme === "dark" ? "text-gray-400" : "text-gray-600",
                )}
              >
                or
              </span>{" "}
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

export default ForgotPasswordCode;
