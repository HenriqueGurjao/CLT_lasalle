"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CircleNotch } from "phosphor-react";
import fetchWithAuth from "@/utils/fetchWithAuth";

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState<UserProps | null>(null);
  const [matricula, setMatricula] = useState<string>("");
  const [isActive, setIsActive] = useState(false);
  
  
  useEffect(() => {
    const rotasIgnoradas = ["/recuperar_senha", "/auth", "/ativar_conta", "/redefinir_senha"];
    if (typeof window !== "undefined") {
      setLoading(true); 
      const isFirstVisit = !sessionStorage.getItem("visited");
      const localMatricula = localStorage.getItem("matricula");
      setMatricula(localMatricula ?  localMatricula : "")
      
      const getRole = async () => {
        try{
          const fetchRole = await fetchWithAuth(`http://localhost:8000/api/v1/auth/verify-role`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }) as Response;
          const roleResponse = await fetchRole.json();
          setRole(roleResponse.role);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }

      const checkAuth = async () => {
        try {
          if (rotasIgnoradas.some(r => path.startsWith(r)) || path === "/"){
            return 
          }
          const response = await fetch("http://localhost:8000/api/v1/auth/refresh", {
            method: "POST",
            credentials: "include",
          });

          
          
          if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);

            if (path === "/auth") {
              router.push("/inicio");
            } 
            // else {
            //   router.push("/inicio"); 
            // }
          } else {
            const data = await response.json();
            setIsAuthenticated(false);
            router.push("/auth");
          }

        } catch (error) {
          setIsAuthenticated(false);
          router.push("/auth");
        } finally {
          setLoading(false); 
        }
      };

      const needActivateAccount = async () => {
        if (rotasIgnoradas.some(r => r !== "/" && path.startsWith(r)) || path === "/"){
          return 
        }
        getRole();

        const userActive = await fetchWithAuth("http://localhost:8000/api/v1/conta_ativa?matricula="+localMatricula, {
          method: "GET",
          credentials: "include",
        })
        
        const isUserActive = await userActive?.json() 
        setIsActive(isUserActive)

        if (!isUserActive && path !== "/ativar_conta") {
          router.push("/ativar_conta");
        }
      
        if (isUserActive && path === "/ativar_conta") {
          router.push("/inicio");
        }
      
        return isUserActive;
      }

      // if(rotasIgnoradas.some(r => path.startsWith(r))){
      //   setLoading(false)
      //   return 
      // }

      if (isFirstVisit) {
        sessionStorage.setItem("visited", "true");
        setLoading(true);
        setFirstVisit(true);

        checkAuth();
      } 
      if (path === "/auth") {
        setLoading(true);
        checkAuth();
      } else {
        setLoading(false);
      }
      needActivateAccount();
    } 
  }, [isActive, path, router]);

  // useEffect(() => {
    
  //   const matr = localStorage.getItem("matricula") || "";
  //   if( matr === "" && path !== "/auth" && path !== '/redefinir_senha') {
  //     console.log("Redirecionando para a página de autenticação");
  //     // window.location.href = "/auth";
  //   }
  // }, [path])

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setMatricula("");
    localStorage.removeItem("matricula");
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
