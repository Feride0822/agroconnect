import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import userStore from "@/store/UserStore";
import { toast } from "react-toastify";

const GoogleOAuthHandler = () => {
  const { actualTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');
  const login = userStore((state) => state.login);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get tokens from URL parameters (for login)
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        
        // Get message and email (for registration)
        const message = searchParams.get('message');
        const email = searchParams.get('email');

        console.log('OAuth callback params:', { accessToken, refreshToken, message, email });

        if (accessToken && refreshToken) {
          // This is a login flow - user already exists
          console.log('Processing Google login with tokens');
          
          // Store the JWT tokens
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);

          // You'll need to fetch user data using the access token
          // For now, I'll create a minimal user object
          // You should replace this with an API call to get user data
          const userForStore = {
            id: "google_user", // You should get this from your backend
            email: email || "google_user@example.com", // Get from token or API
            role: "Farmers", // Default role, should come from your backend
            first_name: "Google",
            last_name: "User",
            phone_number: "",
            region: "",
          };

          login(userForStore, accessToken);
          
          setStatus('success');
          setMessage('Login successful! Redirecting...');
          toast.success('Google login successful!');

          // Navigate based on user role
          setTimeout(() => {
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
                navigate("/profile");
                break;
            }
          }, 2000);

        } else if (message && email) {
          // This is a registration flow - new user created
          console.log('Processing Google registration');
          
          setStatus('success');
          setMessage('Registration completed successfully! Please complete your profile.');
          toast.success('Google registration successful!');
          
          // Navigate to complete profile page
          setTimeout(() => {
            navigate("/register/complete-profile", { 
              state: { 
                email: email,
                isGoogleRegistration: true 
              } 
            });
          }, 2000);

        } else {
          // No valid parameters found
          throw new Error('Invalid OAuth callback parameters');
        }

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        toast.error('Google authentication failed');
        
        // Redirect to login page after error
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, login]);

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center transition-colors duration-300",
        actualTheme === "dark" ? "bg-gray-900" : "bg-gray-50"
      )}
    >
      <div className="w-full max-w-md p-4">
        <Card
          className={cn(
            "shadow-xl",
            actualTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          )}
        >
          <CardHeader className="text-center">
            <CardTitle
              className={cn(
                "text-2xl font-bold",
                actualTheme === "dark" ? "text-white" : "text-gray-900"
              )}
            >
              {status === 'processing' && 'Processing...'}
              {status === 'success' && 'Success!'}
              {status === 'error' && 'Error'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {status === 'processing' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                <p className={cn(
                  actualTheme === "dark" ? "text-gray-300" : "text-gray-600"
                )}>
                  Processing your Google authentication...
                </p>
              </div>
            )}

            {status === 'success' && (
              <Alert className={cn(
                "mb-4",
                actualTheme === "dark"
                  ? "bg-green-900/20 border-green-800/50 text-green-300"
                  : "bg-green-50 border-green-200 text-green-600"
              )}>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <Alert className={cn(
                "mb-4",
                actualTheme === "dark"
                  ? "bg-red-900/20 border-red-800/50 text-red-300"
                  : "bg-red-50 border-red-200 text-red-600"
              )}>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleOAuthHandler;
