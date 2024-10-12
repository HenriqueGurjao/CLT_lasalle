"use client"

import { toast } from "@/hooks/use-toast";


const fetchWithAuth = async (url: string, options: RequestInit = {}) => {

  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', 
    });
    
  
    if (response.status === 401) {
      const refreshResponse = await fetch("http://localhost:8000/api/v1/auth/refresh", {
        method: "POST",
        credentials: "include", 
      });
      
      if (refreshResponse.ok) {
        return await fetch(url, {
          ...options,
          credentials: 'include',
        }); 
      } else {
        window.location.href = '/auth';
      }
    }
    
    return response; 
  } catch (err: any) {
      toast({
        title: "Erro interno no servidor: ",
      })
      try {
        const refreshResponse = await fetch("http://localhost:8000/api/v1/auth/refresh", {
          method: "POST",
          credentials: "include", 
        });

        if (refreshResponse.ok) {
          const retryResponse = await fetch(url, {
            ...options,
            credentials: 'include',
          });
          
          if (!retryResponse.ok) {
            throw new Error(`Error: ${retryResponse.status}`);
          }
          return retryResponse;
        } else {
          window.location.href = '/auth'; 
        }
      } catch (refreshError) {
        window.location.href = '/auth'; 
      }
    }
};

export default fetchWithAuth;
