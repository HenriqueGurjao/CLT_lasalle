"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import fetchWithAuth from "@/utils/fetchWithAuth"; 
import { CadProjetoFormSchema, EditarProjetoFormSchema, Status } from "./CadFormsSchema";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { ProjetoFinal } from "../filters.dtypes";

export type FormSchemaType = z.infer<typeof CadProjetoFormSchema>;

export function EditProjetoForm(projeto: ProjetoFinal | null, isEdit?: boolean,) {

  console.log("isEdit", isEdit);
  
  const form = useForm<z.infer<typeof EditarProjetoFormSchema>>({
    resolver: zodResolver(EditarProjetoFormSchema),
    defaultValues: {
      project_id: projeto ? projeto.id : undefined,
      aluno_matr: projeto && isEdit ? projeto.aluno_matr : "",
      orientador_matr: projeto && isEdit ? projeto.orientador_matr : "",
      status:  projeto?.status ? projeto.status : Status.EM_DESENVOLVIMENTO,
      titulo: projeto ? projeto.titulo : "",
      tags: projeto && isEdit 
            ? projeto.tags.map(tag => ({ titulo: tag })) 
            : [],
    },
  });


   useEffect(() => {
    if (projeto && isEdit) {
      form.reset({
        aluno_matr: projeto.aluno_matr,
        orientador_matr: projeto.orientador_matr,
        status: Status[projeto.status as keyof typeof Status], 
        titulo: projeto.titulo,
        tags: projeto.tags.map(tag => ({
          titulo: tag,
          area_envolvida: "",
        })),
      });
    }
  }, [projeto, isEdit, form]);

  function isValidStatus(value: any): value is Status {
    const isValid = Object.values(Status).includes(value)
    console.log(isValid)
    return isValid;
  }
  
  function parseStatus(input: string): Status | undefined {
    return Object.values(Status).find(status => status === input);
  }

  type StatusKey = keyof typeof Status;
// StatusKey = "EM_DESENVOLVIMENTO" | "PAUSADO" | "TRANCADO" | "APROVADO" | "REPROVADO"

  async function onSubmit(values: z.infer<typeof EditarProjetoFormSchema>) {
    
    if (!projeto) {
      throw new Error("Projeto não pode ser nulo.");
    }
    // console.log(values, Status[values.status as keyof typeof Status], Status.APROVADO)
    try {
      const projetoData = {
        aluno_matr: values.aluno_matr,
        orientador_matr: values.orientador_matr,
        status: values.status,
        titulo: values.titulo,
        tags: projeto && projeto.tags.map(tag => ({ titulo: tag, area_envolvida: "" })),
      };
      
      const formData = new FormData();
      formData.append("projeto_data", JSON.stringify(projetoData)); 
     
      const response = await fetchWithAuth("http://localhost:8000/api/v1/coordenador/professor/projeto-final/"+ values.project_id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projetoData),
        credentials: "include",
      });
  
      if (response && !response.ok) {
        const errorData = await response.json().catch(() => null);
        // const errorMessage = errorData?.detail || `Erro ao cadastrar (código ${response.status}).`;
        // console.log("errorData", errorData.detail[0])
        toast({
          title: "Erro!",
          description: errorData.detail[0].msg ,
          variant: "destructive",
        });
  
        return;
      }
  
      // const data = response && await response.json();

  
      toast({
        title: "Projeto Editado com sucesso!",
      });
      form.reset();
      window.location.reload();
    } catch (error) {
      toast({
        title: "Sessao perdida, atualize a pagina: " + error,
      })
    }
  }

  return {
    form,
    onSubmit,
  };
}
