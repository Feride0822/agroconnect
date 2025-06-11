import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Home,
  BarChart3,
  TrendingUp,
  User,
  LogIn,
  Settings,
  Leaf,
  Menu,
  X,
  Users,
  BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import userStore from "@/store/UserStore";

const Sidebar = () => {
  const location = useLocation();
  const { actualTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = userStore();
  const role = user?.role;

  const navItems =
  role === "farmer"
    ? [
        { path: "/statistics", label: "Analytics", icon: TrendingUp },
        { path: "/profile", label: "Profile", icon: User },
        { path: "/settings", label: "Settings", icon: Settings },
      ]
    : role === "exporter"
    ? [
        { path: "/farmers", label: "Farmers", icon: Users },
        { path: "/profile", label: "Profile", icon: User },
        { path: "/settings", label: "Settings", icon: Settings },
      ]
    : role === "analyst"
    ? [
        { path: "/statistics", label: "Analytics", icon: BarChart3 },
        { path: "/profile", label: "Profile", icon: User },
        { path: "/settings", label: "Settings", icon: Settings },
      ]
    : [
        // Default items for unauthenticated or unknown role
        { path: "/", label: "Home", icon: Home },
        { path: "/login", label: "Login", icon: LogIn },
        { path: "/register", label: "Register", icon: User },
        { path: "/news", label: "News", icon: BookOpen },
        { path: "/settings", label: "Settings", icon: Settings },
      ];

  const sidebarClasses = cn(
    "fixed right-0 top-0 h-full w-80 z-50 transition-transform duration-300 ease-in-out",
    actualTheme === "dark"
      ? "bg-gray-900 border-l border-gray-700"
      : "bg-white border-l border-gray-200",
    isOpen ? "translate-x-0" : "translate-x-full",
  );
  useEffect(() => {
    if(isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return() => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-4 right-4 z-50 md:hidden",
          actualTheme === "dark"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-green-500 hover:bg-green-600",
          "text-white shadow-lg",
        )}
        size="sm"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(sidebarClasses, "md:translate-x-0 ")}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div
            className={cn(
              "p-6 border-b",
              actualTheme === "dark" ? "border-gray-700" : "border-gray-200",
            )}
          >
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              onClick={() => setIsOpen(false)}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
                  actualTheme === "dark"
                    ? "bg-green-600 group-hover:bg-green-500"
                    : "bg-green-500 group-hover:bg-green-600",
                )}
              >
                <img src="/AgroConnect 3.png" alt="Logo"/>
                {/* <Leaf className="h-6 w-6 text-white" /> */}
              </div>
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-xl font-bold",
                    actualTheme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  AgroConnect
                </span>
                <span
                  className={cn(
                    "text-sm",
                    actualTheme === "dark" ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Agricultural Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                  location.pathname === path
                    ? actualTheme === "dark"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-green-500 text-white shadow-lg"
                    : actualTheme === "dark"
                      ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content spacing for desktop */}
      <div className="hidden md:block w-80" />
    </>
  );
};

export default Sidebar;
