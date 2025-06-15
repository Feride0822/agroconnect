import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Sprout,
  Users,
} from "lucide-react";
import { regions } from "@/lib/agricultural-data";
import axios from "axios";
import { Base_Url } from "@/App";
import { toast, ToastContainer } from "react-toastify"; // Re-added react-toastify imports
import "react-toastify/dist/ReactToastify.css"; // Re-added react-toastify CSS import

const Register = () => {
  const { actualTheme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "", // Consistent with your requirement
    last_name: "", // Consistent with your requirement
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    region: "",
    phone_number: "",
    re_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Helper for showing toasts - Re-added for proper feedback
  const showToastMessage = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "success",
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
    if (error) setError(""); // Clear error when user types
    if (success) setSuccess(false); // Clear success message if user starts typing again
  };

  // Helper for Select components, as they don't use e.target.value
  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when selection changes
  };

  const validateForm = () => {
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password ||
      !formData.role ||
      !formData.region ||
      !formData.phone_number ||
      !formData.re_password
    ) {
      setError(
        "Please fill in all required fields (First Name, Last Name, Email, Password, Role, Region, Phone).",
      );
      showToastMessage("Please fill in all required fields.", "error"); // Added toast
      return false;
    }

    if (formData.password !== formData.re_password) {
      setError("Passwords do not match.");
      showToastMessage("Passwords do not match.", "error"); // Added toast
      return false;
    }

    // Increased password length for better security
    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters long.");
      showToastMessage("Password must be at least 4 characters long.", "error"); // Added toast
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      showToastMessage("Please enter a valid email address.", "error"); // Added toast
      return false;
    }
    const phoneRegex = /^\+?\d{9,15}$/; // Example: +998901234567 or 901234567
    if (!phoneRegex.test(formData.phone_number)) {
      setError("Please enter a valid phone number (9-15 digits, optional +).");
      showToastMessage(
        "Please enter a valid phone number (9-15 digits, optional +).",
        "error",
      ); // Added toast
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      const registerEndpoint = `${Base_Url}/accounts/register/`; // Your actual backend registration endpoint

      // Send the user data to your real backend
      const res = await axios.post(registerEndpoint, {
        first_name: formData.first_name, // Changed to first_name
        last_name: formData.last_name, // Changed to last_name
        email: formData.email,
        password: formData.password,
        re_password: formData.re_password,
        role: formData.role,
        region: formData.region,
        phone_number: formData.phone_number,
      });

      console.log("Registration successful on backend:", res.data); // Log the backend response
      setSuccess(true);
      showToastMessage(
        "Registration successful! You can now log in.",
        "success",
      ); // Corrected to use toast

      setTimeout(() => {
        navigate("/confirm", { state: { email: formData.email } });
      }, 1500); // 1.5 seconds delay
    } catch (err: any) {
      console.error("Registration error:", err); // Log the full error for debugging
      setIsLoading(false); // Ensure loading is stopped even on error

      if (axios.isAxiosError(err) && err.response) {
        let errorMessage = "Registration failed. Please try again.";

        if (err.response.data) {
          if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data.detail) {
            errorMessage = err.response.data.detail;
          } else if (
            err.response.data.email &&
            Array.isArray(err.response.data.email)
          ) {
            errorMessage = `Email error: ${err.response.data.email.join(", ")}`;
          } else if (
            err.response.data.phone_number &&
            Array.isArray(err.response.data.phone_number)
          ) {
            errorMessage = `Phone error: ${err.response.data.phone_number.join(", ")}`;
          } else if (
            err.response.data.non_field_errors &&
            Array.isArray(err.response.data.non_field_errors)
          ) {
            errorMessage = err.response.data.non_field_errors.join(", ");
          }
        }

        setError(errorMessage); // Ensured only one setError call
        showToastMessage(`Registration failed: ${errorMessage}`, "error"); // Added toast

        // Specific handling for common backend status codes
        if (err.response.status === 409) {
          // Conflict (e.g., email/phone already exists)
          setError("Account with this email or phone already exists."); // Overwrites generic error if more specific
          showToastMessage(
            "Account with this email or phone already exists.",
            "warning",
          );
        } else if (err.response.status === 400) {
          // Bad Request (e.g., validation failed on backend)

          setError(`Validation error: ${errorMessage}`);
          showToastMessage(`Validation error: ${errorMessage}`, "error");
        }
      } else {
        setError(
          err.message ||
            "An unexpected error occurred during registration. Check your network.",
        );
        showToastMessage(
          "An unexpected error occurred. Please check your network connection.",
          "error",
        );
      }
    } finally {
      setIsLoading(false); // Ensure isLoading is always set to false
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
      )}
    >
      <Sidebar />
      <div className="flex-1 md:mr-80 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
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
            <p
              className={cn(
                "mt-4 text-lg",
                actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
              )}
            >
              Join the farming community
            </p>
          </div>

          {/* Registration Form */}
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
                Create Account
              </CardTitle>
              <p
                className={cn(
                  "text-center",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                )}
              >
                Sign up to access agricultural management tools
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="first_name" // Consistent htmlFor
                      className={cn(
                        "font-medium",
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700",
                      )}
                    >
                      First Name *
                    </Label>
                    <Input
                      id="first_name" // Consistent id
                      type="text"
                      placeholder="Your First Name"
                      value={formData.first_name} // Consistent value
                      onChange={
                        (e) => handleInputChange("first_name", e.target.value) // Consistent field key
                      }
                      className={cn(
                        "focus:ring-green-500 focus:border-green-500",
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                          : "bg-white border-gray-300",
                      )}
                      required
                    />
                  </div>
                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="last_name" // Consistent htmlFor
                      className={cn(
                        "font-medium",
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700",
                      )}
                    >
                      Last Name *
                    </Label>
                    <Input
                      id="last_name" // Consistent id
                      type="text"
                      placeholder="Your Last Name"
                      value={formData.last_name} // Consistent value
                      onChange={
                        (e) => handleInputChange("last_name", e.target.value) // Consistent field key
                      }
                      className={cn(
                        "focus:ring-green-500 focus:border-green-500",
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                          : "bg-white border-gray-300",
                      )}
                      required // Made required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
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
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={cn(
                        "focus:ring-green-500 focus:border-green-500",
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                          : "bg-white border-gray-300",
                      )}
                      required // Made required
                    />
                  </div>
                  {/* Phone */}
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
                      Phone Number *
                    </Label>
                    <Input
                      id="phone_number"
                      type="tel" // Use type="tel" for phone numbers
                      placeholder="+998 XX XXX XX XX"
                      value={formData.phone_number}
                      onChange={(e) =>
                        handleInputChange("phone_number", e.target.value)
                      }
                      className={cn(
                        "focus:ring-green-500 focus:border-green-500",
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                          : "bg-white border-gray-300",
                      )}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className={cn(
                        "font-medium",
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700",
                      )}
                    >
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Choose a password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
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
                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="re_password"
                      className={cn(
                        "font-medium",
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700",
                      )}
                    >
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="re_password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.re_password}
                        onChange={(e) =>
                          handleInputChange("re_password", e.target.value)
                        }
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
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Role Selection (Dropdown) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className={cn(
                        "font-medium",
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700",
                      )}
                    >
                      Role *
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={
                        (value) => handleSelectChange("role", value) // Changed to handleSelectChange
                      }
                      required // Mark select as required
                    >
                      <SelectTrigger
                        className={cn(
                          "focus:ring-green-500 focus:border-green-500",
                          actualTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300",
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
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700",
                      )}
                    >
                      Region *
                    </Label>
                    <Select
                      value={formData.region}
                      onValueChange={
                        (value) => handleSelectChange("region", value) // Changed to handleSelectChange
                      }
                      required // Mark select as required
                    >
                      <SelectTrigger
                        className={cn(
                          "focus:ring-green-500 focus:border-green-500",
                          actualTheme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300",
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
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="rounded bg-gray-700 border-gray-600 mt-0.5"
                    required
                  />
                  <Label
                    htmlFor="terms"
                    className={cn(
                      "leading-relaxed",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    I agree to the{" "}
                    <Link
                      to="#"
                      className="text-green-500 hover:text-green-600 transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="#"
                      className="text-green-500 hover:text-green-600 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg shadow-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Sprout className="h-5 w-5 mr-2" />
                      Create Account
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p
                  className={cn(
                    "mb-2",
                    actualTheme === "dark" ? "text-white" : "text-gray-700",
                  )}
                >
                  or
                </p>
                <Button
  variant="outline"
  className="w-full flex items-center justify-center space-x-2 border border-gray-300 hover:bg-gray-100 hover:text-black transition"
  onClick={() => {
    window.location.href = `${Base_Url}/login/google/`;
  }}
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    alt="Google logo"
    className="w-5 h-5"
  />
  <span>Continue with Google</span>
</Button>

              </div>

              <div className="mt-8 text-center">
                <p
                  className={cn(
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-green-500 hover:text-green-600 font-medium transition-colors"
                  >
                    Sign In
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
                actualTheme === "dark" ? "text-gray-400" : "text-gray-500",
              )}
            >
              &copy; 2025 AgroConnect. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* Make sure ToastContainer is rendered */}
    </div>
  );
};

export default Register;
