import { useState, useEffect } from "react"; // Import useEffect
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Base_Url } from "@/App";
import "react-toastify/dist/ReactToastify.css";
import { Alert, AlertDescription } from "@/components/ui/alert"; // Import Alert and AlertDescription for better error display
import { AlertCircle, Loader2 } from "lucide-react"; // Import AlertCircle and Loader2 icons
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme
import { cn } from "@/lib/utils"; // Import cn

const RegisterConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { actualTheme } = useTheme(); // Use theme context

  // Passed via navigate("/confirm", { state: { email } }) from the Register page
  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if email is not present (e.g., direct access or refresh)
  useEffect(() => {
    if (!email) {
      toast.error("Please register first to get a verification code.");
      navigate("/register"); // Redirect to the registration page
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) { // Double check email exists before submitting
      setError("Email not found. Please restart registration.");
      toast.error("Email not found. Please restart registration.");
      return;
    }

    if (!/^\d{4}$/.test(code)) {
      setError("Please enter a valid 4-digit code.");
      toast.error("Please enter a valid 4-digit code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${Base_Url}/accounts/verify-register/`,
        {
          email, // <--- IMPORTANT: Added email to the payload
          code,
        },
        {
          withCredentials: true,
        },
      );

      toast.success("Email verified successfully! You can now log in.");
      navigate("/login");
    } catch (err: any) {
      console.error("Verification error:", err);
      console.error("Response data:", err.response?.data);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.code?.[0] || // Handle specific backend error for code
        "Invalid or expired code. Please try again.";
      setError(errorMessage);
      toast.error("Verification failed: " + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "flex justify-center items-center min-h-screen p-4 transition-colors duration-300",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
      )}
    >
      <ToastContainer />
      <Card
        className={cn(
          "w-full max-w-md shadow-xl",
          actualTheme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200",
        )}
      >
        <CardHeader>
          <CardTitle
            className={cn(
              "text-center text-3xl font-bold",
              actualTheme === "dark" ? "text-white" : "text-gray-900",
            )}
          >
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <p
              className={cn(
                "text-sm",
                actualTheme === "dark"
                  ? "text-gray-300"
                  : "text-gray-600",
              )}
            >
              We've sent a 4-digit verification code to{" "}
              <strong className={cn(actualTheme === "dark" ? "text-green-400" : "text-green-600")}>
                {email || "your email"}
              </strong>
              .
            </p>

            <Input
              type="text"
              maxLength={4}
              inputMode="numeric" // Optimize for numeric input on mobile
              pattern="\d{4}" // HTML5 pattern for 4 digits
              placeholder="Enter 4-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={cn(
                "focus:ring-green-500 focus:border-green-500 text-center text-xl tracking-widest",
                actualTheme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  : "bg-white border-gray-300",
              )}
              required
            />

            {error && (
              <Alert
                className={cn(
                  "mb-4",
                  actualTheme === "dark"
                    ? "bg-red-900/20 border-red-800/50 text-red-300"
                    : "bg-red-50 border-red-200 text-red-600",
                )}
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className={cn(
                "w-full py-3 text-lg shadow-lg transition-all duration-300",
                actualTheme === "dark"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white",
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying...
                </div>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterConfirm;