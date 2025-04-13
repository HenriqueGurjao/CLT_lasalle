"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import fetchWithAuth from "@/utils/fetchWithAuth"; 
import { useRouter } from "next/navigation"; 
import { useAuth } from "@/contexts/AuthProvider";
import { ResetPasswordSchema } from "./ResetPasswordForms";
import { toast } from "@/hooks/use-toast";

export function useResetPassword() {

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter(); 

  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {


    // try {
    //   const response = await fetch(`http://localhost:8000/api/v1/enviar_email_recuperacao?email=`+values.email, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     credentials: "include", 
    //   });

    //   const responseData = await response?.json();
    //   console.log(responseData)

    //   if (response && !response.ok) {
    //     const errorData = await response.json();
    //     console.log(errorData)
    //     toast({
    //       title: "Erro ao ativar conta",
    //       description: errorData?.detail || "Erro inesperado, por favor tente novamente.",
    //       variant: "destructive",
    //     });
    //     return;
    //     // if (response.status === 400) {
    //     //   alert("Senha inválida");
    //     // } else if (response.status === 404) {
    //     //   alert("Usuário não encontrado");
    //     // } else {
    //     //   alert("Erro inesperado, por favor tente novamente.");
    //     // }
    //     // return;
    //   }

    //   // const data = response && await response.json();
    //   toast({
    //     title: "Email de recuperacao enviado com sucesso.",
    //   });

    //   setTimeout(() => {
    //     // router.push("/auth");
    //   }, 2000)
    // } catch (error) {
    //   alert("Erro interno no servidor: " + error);
    // }
  }

  return {
    form,
    onSubmit,
  };
}
