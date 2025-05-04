"use client"
 
import { z } from "zod"

export const CadCursoFormSchema = z.object({
  nome: z.string().min(1, {
    message: "Nome não pode ser vazio.",
  }),
  descricao: z.string().min(10, {
    message: "Descrição deve ter mais que 10 caracteres.",
  }),
  periodo: z.string().min(1, {
    message: "Período não pode ser vazio.",
  }),
});
