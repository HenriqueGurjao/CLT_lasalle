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
      aluno_matr: projeto && isEdit ? projeto.aluno_matr : "",
      orientador_matr: projeto && isEdit ? projeto.orientador_matr : "",
      status:  Status.EM_DESENVOLVIMENTO,
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

  async function onSubmit(values: z.infer<typeof EditarProjetoFormSchema>) {

    try {
      const projetoData = {
        aluno_matr: values.aluno_matr,
        orientador_matr: values.orientador_matr,
        status: values.status,
        titulo: values.titulo,
        tags: values.tags,
      };
      
      const formData = new FormData();
      formData.append("projeto_data", JSON.stringify(projetoData)); 
     

      // const response = await fetch("http://localhost:8000/api/v1/professor/projeto-final", {
      //   method: "POST",
      //   body: formData,
      //   credentials: "include",
      // });
  
      // if (!response.ok) {
      //   const errorData = await response.json().catch(() => null);
      //   const errorMessage = errorData?.detail || `Erro ao cadastrar (código ${response.status}).`;
  
      //   toast({
      //     title: "Erro!",
      //     description: errorMessage.split(":")[1],
      //     variant: "destructive",
      //   });
  
      //   return;
      // }
  
      // const data = response && await response.json();

  
      toast({
        title: "Projeto Editado com sucesso!",
      });
      form.reset();
    } catch (error) {
      // toast({
      //   title: "Erro interno no servidor: " + error,
      // })
    }
  }

  return {
    form,
    onSubmit,
  };
}
