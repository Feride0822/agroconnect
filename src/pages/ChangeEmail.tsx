import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Base_Url } from "@/App";
import userStore from "@/store/UserStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const ChangeEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = userStore();

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const newEmail = location.state?.newEmail;

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${Base_Url}/accounts/profile/confirm-email-change/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ new_email: newEmail, code }),
      });

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      navigate("/profile"); // explicitly navigate back to profile after success
    } catch (error) {
      console.error("Verification error:", error);
      setError("Invalid or expired verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">{t("new_email")}</h2>
      <p className="mb-6">{t("enter_co")}<strong>{newEmail}</strong></p>

      <Input
        className="text-center mb-4 w-48"
        maxLength={4}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="4-digit code"
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Button onClick={handleVerifyCode} disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Verify Email"}
      </Button>
    </div>
  );
};

export default ChangeEmail;
