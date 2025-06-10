import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Sidebar from "@/components/layout/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Leaf, Eye, EyeOff, AlertCircle, Sprout } from "lucide-react";
import userStore from "@/store/UserStore";
import axios from "axios";
import { Base_Url } from "@/App";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { actualTheme } = useTheme();
  const navigate = useNavigate();
  const [emailOrPhone, setemailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const login = userStore((state) => state.login);

  const showToastMessage = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
    });
  };
  interface CrudCrudUser {
    _id: string; // CRUDCrud adds this automatically
    email?: string;
    phone?: string; // If you store phone as a separate field
    password: string; // WARNING: Storing plain text password is BAD for real apps!
    role: "farmer" | "exporter" | "analyst" | string;
    name?: string;
    surname?: string;
    region?: string;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      // 1. Fetch ALL "users" from CRUDCrud
      // Replace 'users' with whatever resource name you use for users in CRUDCrud
      const response = await axios.get<CrudCrudUser[]>(`${Base_Url}/users`);
      const allCrudCrudUsers = response.data;
      console.log("All users from CRUDCrud:", allCrudCrudUsers);

      // 2. Manually find the user based on emailOrPhone and password
      const foundUser = allCrudCrudUsers.find(
        (u) =>
          (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
      );

      if (foundUser) {
        // 3. Simulate a token (CRUDCrud doesn't provide one)
        const mockToken = `crudcrud_mock_token_${foundUser._id}`; // Example mock token

        // 4. Transform CrudCrudUser to your userStore's expected User type
        // Ensure your userStore.login expects an object like this:
        const userForStore = {
          id: foundUser._id, // Use CRUDCrud's _id as your user ID
          email: foundUser.email,
          role: foundUser.role,
          name: foundUser.name || 'User', // Provide a default name if not present
          // Add any other properties your userStore expects
          phone: foundUser.phone, // If you store phone as a separate field
          password: foundUser.password, 
          surname: foundUser.surname,
          region: foundUser.region,

        };

        // Basic validation before logging in
        if (!userForStore.id || !userForStore.role) {
            throw new Error("User data from CRUDCrud is incomplete (missing ID or role).");
        }

        login(userForStore, mockToken); // Log in to your user store

        setIsLoading(false);
        showToastMessage("Login successful!", "success");

        // Determine the correct route based on the user's role
        switch (userForStore.role) {
          case "farmer":
            navigate("/statistics");
            break;
          case "exporter":
            navigate("/farmers");
            break;
          case "analyst":
            navigate("/dashboard");
            break;
          default:
            navigate("/");
            break;
        }
      } else {
        // No user found or password mismatch
        setError("Invalid email/phone or password.");
        showToastMessage("Invalid credentials", "error");
        setIsLoading(false);
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error("Login error during CRUDCrud fetch/process:", err);
      if (axios.isAxiosError(err) && err.response) {
        // Specific error from CRUDCrud (e.g., resource not found if /users is wrong)
        setError(`API Error: ${err.response.status} - ${err.response.data || err.message}`);
        showToastMessage(`API Error: ${err.response.status}`, "error");
      } else {
        setError(err.message || "An unexpected error occurred during login.");
        showToastMessage("Login failed!", "error");
      }
    }
    // // Simulate API call
    // setTimeout(() => {
    //   if (logenter === "demo@agroconnect.uz" && password === "demo123") {
    //     // Successful login - navigate to dashboard
    //     navigate("/dashboard");
    //   } else {
    //     setError("Invalid credentials. Try demo@agroconnect.uz / demo123");
    //   }
    //   setIsLoading(false);
    // }, 1000);
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
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center w-16 h-16 bg-green-500 rounded-xl">
                  {/* <Leaf className="h-8 w-8 text-white" /> */}
                  <img src="/AgroConnect 3.png" alt="Logo"/>
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
              Welcome back to your farming dashboard
            </p>
          </div>

          {/* Login Form */}
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
                Sign In
              </CardTitle>
              <p
                className={cn(
                  "text-center",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                )}
              >
                Access your agricultural management platform
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
                    htmlFor="logenter"
                    className={cn(
                      "font-medium",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    Email
                  </Label>
                  <Input
                    id="logenter"
                    type="text"
                    placeholder="E-mail Address/Phone Number"
                    value={emailOrPhone}
                    onChange={(e) => setemailOrPhone(e.target.value)}
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
                    htmlFor="password"
                    className={cn(
                      "font-medium",
                      actualTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700",
                    )}
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded bg-gray-700 border-gray-600"
                    />
                    <Label
                      htmlFor="remember"
                      className={cn(
                        actualTheme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700",
                      )}
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="#"
                    className="text-green-500 hover:text-green-600 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg shadow-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Sprout className="h-4 w-4 mr-2" />
                      Sign In
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div
                      className={cn(
                        "w-full border-t",
                        actualTheme === "dark"
                          ? "border-gray-600"
                          : "border-gray-300",
                      )}
                    />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span
                      className={cn(
                        "px-2",
                        actualTheme === "dark"
                          ? "bg-gray-800 text-gray-400"
                          : "bg-white text-gray-500",
                      )}
                    >
                      Demo Account
                    </span>
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-6 p-4 rounded-lg border",
                    actualTheme === "dark"
                      ? "bg-green-900/20 border-green-800/50"
                      : "bg-green-50 border-green-200",
                  )}
                >
                  <p className="text-xs text-green-600 text-center mb-3">
                    For demonstration purposes, use:
                  </p>
                  <div className="text-sm space-y-2 text-center">
                    <div
                      className={cn(
                        "font-medium",
                        actualTheme === "dark" ? "text-white" : "text-gray-900",
                      )}
                    >
                      <strong>Email:</strong> demo@agroconnect.uz
                    </div>
                    <div
                      className={cn(
                        "font-medium",
                        actualTheme === "dark" ? "text-white" : "text-gray-900",
                      )}
                    >
                      <strong>Password:</strong> demo123
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p
                  className={cn(
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-green-500 hover:text-green-600 font-medium transition-colors"
                  >
                    Create Account
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
      <ToastContainer/>
    </div>
  );
};

export default Login;
