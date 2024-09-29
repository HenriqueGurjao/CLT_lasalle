"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CircleNotch } from "phosphor-react";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
  role: string;
  setRole: (role: string) => void;
  user: UserProps | null;
  setUser: (user: UserProps | null) => void;
  matricula: string;
  setMatricula: (matricula: string) => void;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}

interface UserProps {
  nome: string;
  matricula: string;
  periodo: string;
  curso: number;
  email: string;
  status: string;
  data_ingressao: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string>("");
  const [firstVisit, setFirstVisit] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState<UserProps | null>(null);
  const [matricula, setMatricula] = useState<string>("");
  const [isActive, setIsActive] = useState(false);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const isFirstVisit = !sessionStorage.getItem("visited");

      const checkAuth = async () => {
        try {
          const response = await fetch("http://localhost:8000/api/v1/auth/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);
            setRole(data.role);


            if (path === "/auth") {
              router.push("/inicio");
            } else {
              router.push("/inicio"); 
            }
          } else {
            const data = await response.json();
            console.log(data);
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
      } else if (path === "/auth") {
        setTimeout(() => {
          checkAuth();
        }, 3000);
      } else {
        setLoading(false);
      }
    } 
  }, [path, router]);

  useEffect(() => {
    
    const matr = localStorage.getItem("matricula") || "";
    if( matr === "" && path !== "/auth") {
      window.location.href = "/auth";
    }
  }, [path])

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
    <AuthContext.Provider value={{ isAuthenticated, loading, logout, role, setRole, setUser, user, matricula, setMatricula, isActive, setIsActive  }}>
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
