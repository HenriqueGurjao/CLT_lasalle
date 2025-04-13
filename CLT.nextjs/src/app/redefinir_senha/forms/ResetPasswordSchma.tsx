"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation"; 
import { ResetPasswordSchema } from "./ResetPasswordForms";
import { toast } from "@/hooks/use-toast";

export function useResetPassword() {
  const searchParams = useSearchParams(); 
  const tokenFromUrl = searchParams.get("token"); 

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token: tokenFromUrl || "",
      new_password: "",
      new_password_confirm: "",
    },
  });

  useEffect(() => {
    if (tokenFromUrl) {
      form.setValue("token", tokenFromUrl);
    }
  }, [tokenFromUrl, form]);

  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/redefinir_senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const responseData = await response?.json();
      console.log(responseData);

      if (!response.ok) {
        const errorMessage = responseData && responseData.detail 
          ? responseData.detail.split(":").pop()
          : "Erro inesperado, por favor tente novamente.";
      
        toast({
          title: "Erro ao redefinir senha",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Senha redefinida com sucesso.",
      });

      setTimeout(() => {
        window.location.href = "/auth";
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro interno",
        description: "Erro ao processar a requisição.",
        variant: "destructive",
      });
    }
  }

  return {
    form,
    onSubmit,
  };
}
