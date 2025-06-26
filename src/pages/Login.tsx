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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { actualTheme } = useTheme();
  const navigate = useNavigate();
  const [emailOrPhone, setemailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const login = userStore((state) => state.login);
  const { t } = useTranslation();

  const showToastMessage = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      // Send login request to your Django API
      const response = await axios.post(`${Base_Url}/accounts/login/`, {
        login_field: emailOrPhone, 
        password: password,
      });

      const { tokens, user } = response.data;

      console.log("Login successful:", response.data);

      // Store the JWT tokens
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);

      // Transform the user data for your store
      const userForStore = {
        id: user.id,
        email: user.email,
        role: user.role || "user", // Provide default role if missing
        first_name: user.first_name || "User",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        region: user.region || "",
      };

      if (!userForStore.id) {
        throw new Error("User data from API is incomplete (missing user ID).");
      }

      login(userForStore, tokens.access); // Use the real JWT token

      setIsLoading(false);
      showToastMessage("Login successful!", "success");

      console.log("User role after login:", userForStore.role);
      console.log("User data in userStore:", userStore.getState().user);
      console.log(
        "Access Token in localStorage:",
        localStorage.getItem("access_token"),
      );

      switch (userForStore.role) {
        case "Farmers":
          navigate("/statistics");
          break;
        case "Exporters":
          navigate("/farmers");
          break;
        case "Analysts":
          navigate("/dashboard");
          break;
        default:
          navigate("/");
          console.log("returned home because can't find");
          break;
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error("Login error:", err);

      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const errorData = err.response.data;

        if (status === 400) {
          // Handle validation errors from Django
          if (errorData.non_field_errors) {
            setError(errorData.non_field_errors[0]);
          } else if (errorData.detail) {
            setError(errorData.detail);
          } else {
            setError("Invalid credentials");
          }
          showToastMessage("Invalid credentials", "error");
        } else {
          setError(`API Error: ${status} - ${errorData.detail || err.message}`);
          showToastMessage(`Login failed: ${status}`, "error");
        }
      } else {
        setError(err.message || "Network error occurred");
        showToastMessage("Login failed!", "error");
      }
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center transition-colors duration-300",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
      )}
    >
      {/* <Sidebar /> */}
        <div className="w-full max-w-md">
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
                  {t("agri_platform")}
                </span>
              </div>
            </Link>
            <p
              className={cn(
                "mt-4 text-lg",
                actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
              )}
            >
              {t("wel_back")}
            </p>
          </div>

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
                {t("sign_in")}
              </CardTitle>
              <p
                className={cn(
                  "text-center",
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                )}
              >
                {t("acc_manage")}
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
                    {t("email")}
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
                    {t("pass")}
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
                      {t("remember")}
                    </Label>
                  </div>
                  <Link
                    to="forgot-password"
                    className="text-green-500 hover:text-green-600 transition-colors"
                  >
                   {t("for_pass")}
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
                      {t("signing")}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Sprout className="h-4 w-4 mr-2" />
                      {t("sign_in")}
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
                  {t("or")}
                </p>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2 border border-gray-300 hover:bg-gray-100 hover:text-black transition"
                  onClick={() => {
                    window.location.href = `${Base_Url}/accounts/login/google/`;
                  }}
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google logo"
                    className="w-5 h-5"
                  />
                  <span>{t("cont_google")}</span>
                </Button>
              </div>


              <div className="mt-8 text-center">
                <p
                  className={cn(
                    actualTheme === "dark" ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  {t("nh_acc")}{" "}
                  <Link
                    to="/register"
                    className="text-green-500 hover:text-green-600 font-medium transition-colors"
                  >
                    {t("create_acc")}
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
              &copy; {t("rights")}
            </p>
          </div>
        </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
