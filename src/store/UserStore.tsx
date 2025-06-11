import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the user type and store interface
interface UserData {
  first_name: string;
  email: string;
  phone_number: string;
  last_name: string;
  role: "Farmers" | "Exporters" | "Analysts" | string;
  region?: string;
  re_password: string;
  // Add other user fields as needed
}

interface UserStoreState {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean; // Add this for easier checks in protected routes
  // The login action now explicitly takes the user data and the token separately
  login: (userData: UserData, userToken: string) => void;
  logout: () => void;
}

const userStore = create<UserStoreState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false, // Initial state

  login: (userData, userToken) => {
    set({
      user: userData,
      token: userToken,
      isAuthenticated: true, // Set to true on successful login
    });
    // You might want to save token to localStorage here as well
    localStorage.setItem("authToken", userToken);
    localStorage.setItem("userData", JSON.stringify(userData)); // Stringify for localStorage
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false, // Set to false on logout
    });
    // Clear from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  },
}));

export default userStore;
