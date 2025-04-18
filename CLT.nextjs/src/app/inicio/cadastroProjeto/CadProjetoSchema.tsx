"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import fetchWithAuth from "@/utils/fetchWithAuth"; 
import { CadProjetoFormSchema, Status } from "./CadFormsSchema";
import { toast } from "@/hooks/use-toast";

export type FormSchemaType = z.infer<typeof CadProjetoFormSchema>;

export function CadProjetoForm() {
  const form = useForm<z.infer<typeof CadProjetoFormSchema>>({
    resolver: zodResolver(CadProjetoFormSchema),
    defaultValues: {
      aluno_matr: "",
      curso_id: "",
      orientador_matr: "",
      status:  Status.EM_DESENVOLVIMENTO,
      titulo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof CadProjetoFormSchema>) {

    try {
      const response = await fetch("http://localhost:8000/api/v1/professor/projeto-final", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include", 
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null); // Garante que não vai quebrar caso o JSON seja inválido
  
        const errorMessage = errorData?.detail || `Erro ao cadastrar (código ${response.status}).`;
  
        toast({
          title: "Erro!",
          description: errorMessage.split(":")[1],
          variant: "destructive",
        });
  
        return;
      }

      const data = response && await response.json();

      console.log(data);

      toast({
        title: "Projeto cadastrado com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro interno no servidor: " + error,
      })
    }
  }

  return {
    form,
    onSubmit,
  };
}
