"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { ResetPasswordSchema } from "./ResetPasswordForms";
import { toast } from "@/hooks/use-toast";

export function useResetPassword(tokenFromUrl: string | null) {

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token: tokenFromUrl || "",
      new_password: "",
      new_password_confirm: "",
    },
  });

  const [formLoading, setFormLoading] = useState<boolean | null>(null);

  useEffect(() => {
    if (tokenFromUrl) {
      form.setValue("token", tokenFromUrl);
    }
  }, [tokenFromUrl, form]);

  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    try {
      setFormLoading(true);
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
        setFormLoading(null);
        return;
      }

      toast({
        title: "Senha redefinida com sucesso.",
      });
      setFormLoading(false);
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
    formLoading
  };
}
