import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";

const useAuthRedirect = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/auth");
      } else {
        router.push("/inicio"); 
      }
    }
  }, [loading, isAuthenticated, router]);
};

export default useAuthRedirect;