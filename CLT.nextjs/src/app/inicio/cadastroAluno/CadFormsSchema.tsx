"use client"
 
import { z } from "zod"

export enum Status {
  CURSANDO = "CURSANDO",
  TRANCADO = "TRANCADO",
  CONCLUIDO = "CONCLUIDO",
}
 
export const CadStudentFormSchema = z.object({
  matricula: z.string().min(8, {
    message: "Matricula deve ter no mínimo 8 caracteres.",
  }),
  nome: z.string().min(1, {
    message: "Nome não pode ser vazio.",
  }),
  email: z.string().email({
    message: "Não é um e-mail válido.",
  }),
  status: z.enum([Status.CURSANDO, Status.TRANCADO, Status.CONCLUIDO], {
    required_error: "Status é obrigatório.",
  }).default(Status.CURSANDO),
  senha: z.string().min(8, {
    message: "Senha deve ter no mínimo 8 caracteres.",
  }),
  curso: z.string().min(1, {
    message: "Curso é obrigatório.",
  }),
  periodo: z.string().min(1, {
    message: "Período é obrigatório.",
  }).max(2, {
    message: "Período deve ter no máximo 2 caracteres.",  
  }),
  ativo: z.boolean().default(false),
});
