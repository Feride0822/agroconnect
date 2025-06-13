import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import Farmers from "./pages/Farmers";
import News from "./pages/News";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import RegisterConfirm from "./pages/RegisterConfirm";
import ForgotPasswordCode from "./pages/ForgotPasswordCode";
import ForgotPasswordEmail from "./pages/ForgotPasswordEmail";
import ForgotPasswordNewPassword from "./pages/ForgotPasswordNewPassword";
import RegiterGoogle from "./pages/RegisterGoogle";

export const Base_Url = "http://192.168.16.77:8000";
// export const Base_Url = "http://example/api";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/news" element={<News />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/confirm" element={ <RegisterConfirm /> } />
            <Route path="/login/forgot-password" element={ <ForgotPasswordEmail/> }/>
            <Route path="/login/forgot-password/verify-code" element={<ForgotPasswordCode />} />
            <Route path="/login/forgot-password/new-password" element={<ForgotPasswordNewPassword />} />
            <Route path="/register/complete-profile" element={ <RegiterGoogle/>} />

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["Farmers", "Exporters", "Analysts"]}
                />
              }
            >
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route
              element={
                <ProtectedRoute allowedRoles={["Farmers", "Analysts"]} />
              }
            >
              <Route path="/statistics" element={<Statistics />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["Exporters"]} />}>
              <Route path="/farmers" element={<Farmers />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
