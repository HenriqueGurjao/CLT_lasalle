"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleNotch } from "phosphor-react";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isFirstVisit = !sessionStorage.getItem("visited");

      const checkAuth = async () => {
        try {
          const response = await fetch("http://localhost:8000/api/v1/api/v1/auth/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (response.ok) {
            setIsAuthenticated(true);
            router.push("/inicio");
          } else {
            setIsAuthenticated(false);
            router.push("/auth");
          }
        } catch (error) {
          console.error("Failed to refresh token:", error);
          setIsAuthenticated(false);
          router.push("/auth");
        } finally {
          setLoading(false); 
        }
      };

      if (isFirstVisit) {
        sessionStorage.setItem("visited", "true");
        setFirstVisit(true);

        setTimeout(() => {
          checkAuth();
        }, 3000); 
      }
      else {
        setLoading(false);
      }
    } 

  }, [router]);

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setIsAuthenticated(false);
    router.push("/auth");
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <CircleNotch className="text-yellow-500 size-10 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
