"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import fetchWithAuth from "@/utils/fetchWithAuth"; 
import { CadStudentFormSchema, Status } from "./CadFormsSchema";
import { toast } from "@/hooks/use-toast";

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

    console.log(JSON.stringify(values))

    try {
      const response = await fetch("http://localhost:8000/api/v1/coordenador/alunos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include", 
      });

      if (response && !response.ok) {
        toast({
          title: "Erro ao cadastrar aluno.",
          variant: "destructive",
        })
        return;
      }

      const data = response && await response.json();

      console.log(data);

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
