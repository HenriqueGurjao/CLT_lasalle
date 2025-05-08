"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import fetchWithAuth from "@/utils/fetchWithAuth"; 
import { toast } from "@/hooks/use-toast";
import { CadCursoFormSchema } from "./CadCursoFormsSchema";

export type FormSchemaType = z.infer<typeof CadCursoFormSchema>;

export function CadCursoForm() {
  const form = useForm<z.infer<typeof CadCursoFormSchema>>({
    resolver: zodResolver(CadCursoFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      periodo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof CadCursoFormSchema>) {


    try {
      const response = await fetchWithAuth("http://localhost:8000/api/v1/coordenador/curso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include", 
      });

      if (response && !response.ok) {
        const errorData = await response.json();
        toast({
          title: "Erro ao cadastrar curso.",
          description: JSON.stringify(errorData.detail[0].msg || errorData),
          variant: "destructive",
        });
        return;
      }

      // const data = response && await response.json();


      toast({
        title: "Curso cadastrado com sucesso!",
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
