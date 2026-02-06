import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "@/config/permissions.config";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const mockUsers: Record<string, { password: string; user: User }> = {
  "admin@gcbbank.com": {
    password: "admin123",
    user: {
      id: "1",
      name: "Kofi Boateng",
      email: "admin@gcbbank.com",
      role: UserRole.ADMIN,
      department: "IT & Systems",
    },
  },
  "esg@gcbbank.com": {
    password: "esg123",
    user: {
      id: "2",
      name: "Adwoa Mensah",
      email: "esg@gcbbank.com",
      role: UserRole.ESG_MANAGER,
      department: "Risk Management",
    },
  },
  "analyst@gcbbank.com": {
    password: "analyst123",
    user: {
      id: "3",
      name: "Kwame Asante",
      email: "analyst@gcbbank.com",
      role: UserRole.RISK_ANALYST,
      department: "Climate Risk",
    },
  },
  "portfolio@gcbbank.com": {
    password: "portfolio123",
    user: {
      id: "4",
      name: "Ama Darko",
      email: "portfolio@gcbbank.com",
      role: UserRole.PORTFOLIO_MANAGER,
      department: "Portfolio Management",
    },
  },
  "executive@gcbbank.com": {
    password: "exec123",
    user: {
      id: "5",
      name: "Kofi Boateng",
      email: "executive@gcbbank.com",
      role: UserRole.EXECUTIVE,
      department: "Executive Office",
    },
  },
  "data@gcbbank.com": {
    password: "data123",
    user: {
      id: "6",
      name: "Yaa Osei",
      email: "data@gcbbank.com",
      role: UserRole.DATA_ENTRY,
      department: "Data Management",
    },
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const userRecord = mockUsers[email.toLowerCase()];

        if (!userRecord || userRecord.password !== password) {
          throw new Error("Invalid email or password");
        }

        const user = userRecord.user;
        set({ user, isAuthenticated: true });
        return user;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
