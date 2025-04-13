"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import fetchWithAuth from "@/utils/fetchWithAuth"; 
import { useRouter } from "next/navigation"; 
import { AuthFormSchema } from "@/app/auth/forms/AuthForms";
import { useAuth } from "@/contexts/AuthProvider";

export function AuthForm() {
  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      matricula: "",
      senha: "",
    },
  });

  const router = useRouter(); 
  const  { setMatricula, setRole, setIsActive } = useAuth();

  async function onSubmit(values: z.infer<typeof AuthFormSchema>) {


    try {
      const response = await fetchWithAuth("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include", 
      });

      if (response && !response.ok) {
        if (response.status === 400) {
          alert("Senha inválida");
        } else if (response.status === 404) {
          alert("Usuário não encontrado");
        } else {
          alert("Erro inesperado, por favor tente novamente.");
        }
        return;
      }

      const data = response && await response.json();
      console.log(data)
      setMatricula(values.matricula);
      setRole(data.role);
      setIsActive(data.is_active);
      localStorage.setItem("matricula", values.matricula);

      console.log(data.is_active)
      if(data.is_active === false) {
        router.push("/ativar_conta");
      }
      else{
        router.push("/inicio");
      }
    } catch (error) {
      alert("Erro interno no servidor: " + error);
    }
  }

  return {
    form,
    onSubmit,
  };
}
