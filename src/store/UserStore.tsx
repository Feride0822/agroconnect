import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the user type and store interface
interface UserData {
  name: string;
  email: string;
  phone: string;
  surname: string;
  role?: "farmer" | "exporter" | "analyst";
  region?: string;
  token: string;
  // Add other user fields as needed
}

interface UserStoreState {
  user: UserData | null;
  token: string | null;
  // The login action now explicitly takes the user data and the token separately
  login: (userData: UserData, userToken: string) => void;
  logout: () => void;
}

const userStore = create<UserStoreState>((set) => ({
  user: null,
  token: null,
  login: (userData, userToken) => {
    set({ user: userData, token: userToken });
    // You might want to save token to localStorage here as well
    localStorage.setItem('authToken', userToken);
    localStorage.setItem('userData', JSON.stringify(userData));
  },
  logout: () => {
    set({ user: null, token: null });
    // Clear from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },
}));

export default userStore;
