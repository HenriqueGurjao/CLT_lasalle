"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import fetchWithAuth from "@/utils/fetchWithAuth"; 
import { CadStudentFormSchema, Status } from "./CadFormsSchema";
import { toast } from "@/hooks/use-toast";

export type FormSchemaType = z.infer<typeof CadStudentFormSchema>;

export function CadStudentForm() {
  const form = useForm<z.infer<typeof CadStudentFormSchema>>({
    resolver: zodResolver(CadStudentFormSchema),
    defaultValues: {
      matricula: "",
      senha: "",
      curso: "",
      email: "",
      nome: "",
      status: Status.CURSANDO,	
      ativo: false,
      periodo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof CadStudentFormSchema>) {

    try {
      const response = await fetchWithAuth("http://localhost:8000/api/v1/coordenador/alunos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include", 
      });

      if (response && !response.ok) {
        const errorData = await response.json().catch(() => null);

        const errorMessage =
          Array.isArray(errorData?.detail) && errorData.detail[0]?.msg
            ? errorData.detail[0].msg
            : errorData?.detail || `Erro ao cadastrar (código ${response.status}).`;
        
        console.log(errorMessage);

        toast({
          title: "Erro!",
          description: errorMessage.split(":")[1],
          variant: "destructive",
        });

        return; 
      }

      const data = response && await response.json();

      toast({
        title: "Aluno cadastrado com sucesso!",
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
