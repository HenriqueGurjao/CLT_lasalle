"use client"

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', 
  });

  if (response.status === 401) {
    const refreshResponse = await fetch("http://localhost:8000/api/v1/api/v1/auth/refresh", {
      method: "POST",
      credentials: "include", 
    });

    if (refreshResponse.ok) {
      return await fetch(url, {
        ...options,
        credentials: 'include',
      }); 
    } else {
      window.location.href = '/login';
    }
  }

  return response; 
};

export default fetchWithAuth;
