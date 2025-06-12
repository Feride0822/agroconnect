import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Base_Url } from "@/App";
import "react-toastify/dist/ReactToastify.css";

const RegisterConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Passed via navigate("/confirm", { state: { email } })

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{4}$/.test(code)) {
      setError("Please enter a valid 4-digit code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${Base_Url}/accounts/verify-register/`,
        { code },
        {
          withCredentials: true,
        },
      );

      toast.success("Email verified successfully! You can now log in.");
      navigate("/login");
    } catch (err: any) {
      console.error("Verification error:", err);
      console.error("Response data:", err.response?.data);
      setError(
        err.response?.data?.detail ||
          "Invalid or expired code. Please try again.",
      );
      toast.error("Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted px-4">
      <ToastContainer />
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We've sent a 4-digit verification code to{" "}
              <strong>{email || "your email"}</strong>.
            </p>

            <Input
              type="text"
              maxLength={4}
              placeholder="Enter 4-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterConfirm;
