import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

type UserRole = "superadmin" | "owner" | "user" | null;

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  tenantId?: string;
  companyId?: string;
}

interface AuthContextType {
  currentUser: UserData | null;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Mock function to get user role - in a real app, this would fetch from your database
const getUserRole = async (uid: string): Promise<UserRole> => {
  // This is a placeholder. In a real application, you would fetch the user's role from your database
  // For demo purposes, we'll assign roles based on email domains
  const user = await auth.currentUser;
  if (!user || !user.email) return "user";

  if (user.email.includes("admin")) {
    return "superadmin";
  } else if (user.email.includes("owner")) {
    return "owner";
  } else {
    return "user";
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for demo user in localStorage first
    const demoUserJson = localStorage.getItem("demoUser");
    if (demoUserJson) {
      try {
        const demoUser = JSON.parse(demoUserJson);
        setCurrentUser(demoUser);
        setLoading(false);
        return () => {}; // No cleanup needed for localStorage
      } catch (err) {
        console.error("Error parsing demo user:", err);
        localStorage.removeItem("demoUser"); // Remove invalid data
      }
    }

    // If no demo user, use Firebase auth
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (user) {
          const role = await getUserRole(user.uid);
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: role,
            // In a real app, you would fetch these from your database
            tenantId: "default-tenant",
            companyId: "default-company",
          });
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Error in auth state change:", err);
        setError("Failed to authenticate user");
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const role = await getUserRole(userCredential.user.uid);

      setCurrentUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        role: role,
        // In a real app, you would fetch these from your database
        tenantId: "default-tenant",
        companyId: "default-company",
      });
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to login. Please check your credentials.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const role = await getUserRole(userCredential.user.uid);

      setCurrentUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        role: role,
        // In a real app, you would fetch these from your database
        tenantId: "default-tenant",
        companyId: "default-company",
      });
    } catch (err) {
      console.error("Google login error:", err);
      setError("Failed to login with Google.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if it's a demo user first
      if (localStorage.getItem("demoUser")) {
        localStorage.removeItem("demoUser");
        setCurrentUser(null);
      } else {
        // Regular Firebase logout
        await signOut(auth);
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to logout.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    loginWithEmail,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
