"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import fetchWithAuth from "@/utils/fetchWithAuth"; 
import { useRouter } from "next/navigation"; 
import { AuthFormSchema } from "@/app/auth/forms/AuthForms";

export function AuthForm() {
  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      matricula: "",
      senha: "",
    },
  });

  const router = useRouter(); 

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

      if (!response.ok) {
        if (response.status === 400) {
          alert("Senha inválida");
        } else if (response.status === 404) {
          alert("Usuário não encontrado");
        } else {
          alert("Erro inesperado, por favor tente novamente.");
        }
        return;
      }

      const data = await response.json();
      console.log(data); 

      router.push("/inicio");
    } catch (error) {
      alert("Erro interno no servidor: " + error);
    }
  }

  return {
    form,
    onSubmit,
  };
}
