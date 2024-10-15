"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import fetchWithAuth from "@/utils/fetchWithAuth"; 
import { CadTeacherFormSchema, Status } from "./CadFormsSchema";
import { toast } from "@/hooks/use-toast";

export type FormSchemaType = z.infer<typeof CadTeacherFormSchema>;

export function CadProfessorForm() {
  const form = useForm<z.infer<typeof CadTeacherFormSchema>>({
    resolver: zodResolver(CadTeacherFormSchema),
    defaultValues: {
      matricula: "",
      senha: "",
      curso: "",
      email: "",
      nome: "",
      status: Status.PROFESSOR,	
      ativo: false,
      departamento: "",
      funcao: "",
    },
  });

  async function onSubmit(values: z.infer<typeof CadTeacherFormSchema>) {

    console.log(JSON.stringify(values))

    try {
      const response = await fetch("http://localhost:8000/api/v1/coordenador/professores/", {
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
