"use client"
 
import { max } from "date-fns";
import { z } from "zod"

export enum Status {
  EM_DESENVOLVIMENTO = "EM DESENVOLVIMENTO",
  PAUSADO = "PAUSADO",
  TRANCADO = "TRANCADO",
  APROVADO = "APROVADO",
  REPROVADO = "REPROVADO",
}


const tagSchema = z.object({
  titulo: z.string(),
  area_envolvida: z.string(),
});
 
export const CadProjetoFormSchema = z.object({
  curso_id: z.string().min(1, {
    message: "Curso é obrigatório.",
  }),
  orientador_matr: z.string().min(1, {
    message: "Matricula não pode estar vazia.",
  }).max(10, {
    message: "Matricula deve ter no máximo 10 caracteres.",
  }).refine((val) => val.startsWith("00700"), {
    message: "A matrícula deve começar com '00700'.",
  }),
  aluno_matr: z.string().min(1,{
    message: "Matricula não pode estar vazia.",
  }).max(10, {
    message: "Matricula deve ter no máximo 10 caracteres.",
  }).refine((val) => val.startsWith("00500"), {
    message: "A matrícula deve começar com '00500'.",
  }),
  status: z.enum([Status.EM_DESENVOLVIMENTO, Status.PAUSADO, Status.TRANCADO, Status.APROVADO, Status.REPROVADO], {
    required_error: "Status é obrigatório.",
  }).default(Status.EM_DESENVOLVIMENTO),
  titulo: z.string().min(1, {
    message: "Titulo é obrigatório.",
  }),
  tags: z.array(tagSchema),    
  pdf_file: z
    .any()
    .transform((value) => {
      if (value instanceof FileList) return value[0];
      return value;
    })
    .refine((file) => file instanceof File, {
      message: "Arquivo inválido.",
    })
    .refine((file) => file?.type === "application/pdf", {
      message: "O arquivo deve ser um PDF.",
    }),
});


export const EditarProjetoFormSchema = z.object({
  orientador_matr: z.string().min(1, {
    message: "Matricula não pode estar vazia.",
  }).max(10, {
    message: "Matricula deve ter no máximo 10 caracteres.",
  }).refine((val) => val.startsWith("00700"), {
    message: "A matrícula deve começar com '00700'.",
  }),
  aluno_matr: z.string().min(1,{
    message: "Matricula não pode estar vazia.",
  }).max(10, {
    message: "Matricula deve ter no máximo 10 caracteres.",
  }).refine((val) => val.startsWith("00500"), {
    message: "A matrícula deve começar com '00500'.",
  }),
  status: z.enum([Status.EM_DESENVOLVIMENTO, Status.PAUSADO, Status.TRANCADO, Status.APROVADO, Status.REPROVADO], {
    required_error: "Status é obrigatório.",
  }).default(Status.EM_DESENVOLVIMENTO),
  titulo: z.string().min(1, {
    message: "Titulo é obrigatório.",
  }),
  tags: z.array(tagSchema),    
});