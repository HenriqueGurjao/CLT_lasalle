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
      pdf_file: undefined,
      tags: [],
    },
  });

  async function onSubmit(values: z.infer<typeof CadProjetoFormSchema>) {

    try {
      const projetoData = {
        aluno_matr: values.aluno_matr,
        curso_id: values.curso_id,
        orientador_matr: values.orientador_matr,
        status: values.status,
        titulo: values.titulo,
        pdf_file: values.pdf_file, // Isso já é tratado como file
        tags: values.tags, // Aqui já são enviados como objetos
      };
      
      // Convertendo tudo para string JSON
      const formData = new FormData();
      formData.append("projeto_data", JSON.stringify(projetoData)); // Agora é uma string JSON
      
      formData.append("pdf_file", values.pdf_file); // Lembre-se de que o arquivo já é tratado com File
      
      // Enviando a requisição
      const response = await fetch("http://localhost:8000/api/v1/professor/projeto-final", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || `Erro ao cadastrar (código ${response.status}).`;
  
        toast({
          title: "Erro!",
          description: errorMessage.split(":")[1],
          variant: "destructive",
        });
  
        return;
      }
  
      // const data = response && await response.json();

  
      toast({
        title: "Projeto cadastrado com sucesso!",
      });
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
