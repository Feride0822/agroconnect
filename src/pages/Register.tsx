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
  Leaf,
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

const Register = () => {
  const { actualTheme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    region: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.surname ||
      !formData.email ||
      !formData.password ||
      !formData.role ||
      !formData.region ||
      !formData.phone
    ) {
      setError("Please fill in all required fields");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 2) {
      setError("Password must be at least 2 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    const phoneRegex = /^\+?\d{9,15}$/; // Example: +998901234567 or 901234567
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number (9-15 digits, optional +).");
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
      // 1. Check for existing user (email or phone) in CRUDCrud
      // Fetch all users to check for uniqueness (basic, not scalable for real apps)
      const existingUsersResponse = await axios.get(`${Base_Url}/users`);
      const existingUsers = existingUsersResponse.data;

      const isEmailTaken = existingUsers.some((u: any) => u.email === formData.email);
      const isPhoneTaken = existingUsers.some((u: any) => u.phone === formData.phone);

      if (isEmailTaken) {
        setError("This email is already registered.");
        setIsLoading(false);
        return;
      }
      if (isPhoneTaken) {
        setError("This phone number is already registered.");
        setIsLoading(false);
        return;
      }

      // 2. If unique, then POST the new user data to CRUDCrud
      // We explicitly send the fields needed for the user object, and ensure 'phone' is there.
      const res = await axios.post(`${Base_Url}/users`, {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password, // WARNING: Storing plain text password is BAD for real apps!
        role: formData.role,
        region: formData.region,
        phone: formData.phone,
      });

      console.log("Registration successful on CRUDCrud:", res.data);
      setSuccess(true);

      // Use a timeout before navigating to allow toast to be seen
      setTimeout(() => {
        navigate("/login"); // Navigate to login page after successful registration
      }, 1500); // 1.5 seconds delay

    } catch (err: any) {
      console.error("Registration error:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`Registration failed: ${err.response.status} - ${err.response.data?.message || err.message}`);
        setError(`Registration failed: ${err.response.status}`);
      } else {
        setError(err.message || "An unexpected error occurred during registration.");
        setError("Registration failed!");
      }
    } finally {
      setIsLoading(false); // Ensure isLoading is always set to false
    }

    // // Simulate API call
    // setTimeout(() => {
    //   setSuccess(true);
    //   setIsLoading(false);
    // }, 1500);
  };

  if (success) {
    return (
      <div
        className={cn(
          "min-h-screen transition-colors duration-300 flex items-center justify-center p-4",
          actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
        )}
      >
        <Card
          className={cn(
            "w-full max-w-md shadow-xl",
            actualTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
          )}
        >
          <CardContent className="pt-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2
                className={cn(
                  "text-3xl font-bold mb-4",
                  actualTheme === "dark" ? "text-white" : "text-gray-900",
                )}
              >
                Registration Successful!
              </h2>
              <p
                className={cn(
                  "mb-8 text-lg",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                )}
              >
                Welcome to AgroConnect! Your account is ready and you can now
                access all farming tools.
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg shadow-lg transition-all duration-300"
              >
                <Users className="h-5 w-5 mr-2" />
                Continue to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  {/* <Leaf className="h-8 w-8 text-white" /> */}
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
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className={cn(
                        "font-medium",
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700",
                      )}
                    >
                      First Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your First Name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
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
                  <div className="space-y-2">
                    <Label
                      htmlFor="surname"
                      className={cn(
                        "font-medium",
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700",
                      )}
                    >
                      Last Name
                    </Label>
                    <Input
                      id="surname"
                      type="text"
                      placeholder="Your Last Name"
                      value={formData.surname}
                      onChange={(e) =>
                        handleInputChange("surname", e.target.value)
                      }
                      className={cn(
                        "focus:ring-green-500 focus:border-green-500",
                        actualTheme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                          : "bg-white border-gray-300",
                      )}
                    />
                  </div>

                  
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    />
                  </div>
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

                  
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
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
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
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
                      onValueChange={(value) =>
                        handleInputChange("role", value)
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
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farmer">Farmer</SelectItem>
                        <SelectItem value="exporter">Exporter</SelectItem>
                        <SelectItem value="analyst">Market Analyst</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className={cn(
                        "font-medium",
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700",
                      )}
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+998 XX XXX XX XX"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
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
    </div>
  );
};

export default Register;
