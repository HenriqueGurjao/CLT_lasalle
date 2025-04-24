"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import fetchWithAuth from "@/utils/fetchWithAuth"; 
import { CadProjetoFormSchema, Status } from "./CadFormsSchema";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { ProjetoFinal } from "../filters.dtypes";

export type FormSchemaType = z.infer<typeof CadProjetoFormSchema>;

export function CadProjetoForm(projeto: ProjetoFinal | null, isEdit?: boolean,) {
  
  const form = useForm<z.infer<typeof CadProjetoFormSchema>>({
    resolver: zodResolver(CadProjetoFormSchema),
    defaultValues: {
      aluno_matr: projeto && isEdit ? projeto.aluno_matr : "",
      curso_id: projeto && isEdit ? String(projeto.curso_id) : "",
      orientador_matr: projeto && isEdit ? projeto.orientador_matr : "",
      status:  Status.EM_DESENVOLVIMENTO,
      titulo: projeto ? projeto.titulo : "",
      pdf_file: undefined,
      tags: projeto && isEdit 
            ? projeto.tags.map(tag => ({ titulo: tag })) 
            : [],
    },
  });

   useEffect(() => {
    if (projeto && isEdit) {
      form.reset({
        aluno_matr: projeto.aluno_matr,
        curso_id: String(projeto.curso_id),
        orientador_matr: projeto.orientador_matr,
        status: Status[projeto.status as keyof typeof Status], 
        titulo: projeto.titulo,
        pdf_file: undefined,
        tags: projeto.tags.map(tag => ({
          titulo: tag,
          area_envolvida: "",
        })),
      });
    }
  }, [projeto, isEdit, form]);

  async function onSubmit(values: z.infer<typeof CadProjetoFormSchema>) {

    console.log(values, isEdit)
    try {
      const projetoData = {
        aluno_matr: values.aluno_matr,
        curso_id: values.curso_id,
        orientador_matr: values.orientador_matr,
        status: values.status,
        titulo: values.titulo,
        pdf_file: values.pdf_file,
        tags: values.tags,
      };
      
      const formData = new FormData();
      formData.append("projeto_data", JSON.stringify(projetoData)); 
      
      formData.append("pdf_file", values.pdf_file); 

      // const response = await fetch("http://localhost:8000/api/v1/professor/projeto-final", {
      //   method: "POST",
      //   body: formData,
      //   credentials: "include",
      // });
  
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
      form.reset();
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
