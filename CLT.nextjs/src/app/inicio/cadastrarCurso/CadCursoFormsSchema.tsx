"use client"
 
import { z } from "zod"

export const CadCursoFormSchema = z.object({
  nome: z.string().min(1, {
    message: "Nome não pode ser vazio.",
  }),
  descricao: z.string().min(1, {
    message: "Descrição não pode ser vazia.",
  }),
  periodo: z.string().min(1, {
    message: "Período não pode ser vazio.",
  }),
});
