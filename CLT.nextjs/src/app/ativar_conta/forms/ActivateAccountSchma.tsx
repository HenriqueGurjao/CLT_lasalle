"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import fetchWithAuth from "@/utils/fetchWithAuth"; 
import { useRouter } from "next/navigation"; 
import { useAuth } from "@/contexts/AuthProvider";
import { ActivateAccountSchema } from "./ActivateAccountForms";
import { toast } from "@/hooks/use-toast";

export function useActivateAccount() {
  
  const  { matricula } = useAuth();

  const form = useForm<z.infer<typeof ActivateAccountSchema>>({
    resolver: zodResolver(ActivateAccountSchema),
    defaultValues: {
      matricula: matricula ?? "",
      new_password: "",
      password: "",
    },
  });

  const router = useRouter(); 

  async function onSubmit(values: z.infer<typeof ActivateAccountSchema>) {


    try {
      const response = await fetchWithAuth(`http://localhost:8000/api/v1/ativar_conta/${matricula}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: values.password,
          new_password: values.new_password,
          matricula: matricula
        }),
        credentials: "include", 
      });

      if (response && !response.ok) {
        const errorData = await response.json();

        toast({
          title: "Erro ao ativar conta",
          description: errorData?.detail || "Erro inesperado, por favor tente novamente.",
          variant: "destructive",
        });
        return;
        // if (response.status === 400) {
        //   alert("Senha inválida");
        // } else if (response.status === 404) {
        //   alert("Usuário não encontrado");
        // } else {
        //   alert("Erro inesperado, por favor tente novamente.");
        // }
        // return;
      }

      // const data = response && await response.json();
      toast({
        title: "Conta ativada com sucesso!",
      });
      localStorage.setItem("matricula", values.matricula);

      router.push("/inicio");
    } catch (error) {
      // alert("Erro interno no servidor: " + error);
    }
  }

  return {
    form,
    onSubmit,
  };
}
