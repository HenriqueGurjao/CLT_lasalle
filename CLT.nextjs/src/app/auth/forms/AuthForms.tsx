"use client"
 
import { z } from "zod"
 
export const AuthFormSchema = z.object({
  matricula: z.string().min(8, {
    message: "Matricula deve ter no minimo 8 caracteres.",
  }),
  senha: z.string().min(8, {
    message: "Senha deve ter no minimo 8 caracteres.",
  }),
})