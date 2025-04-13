"use client"

import { z } from "zod"

export const ActivateAccountSchema = z
  .object({
    password: z.string().min(8, {
      message: "Senha deve ter no mínimo 8 caracteres.",
    }),
    new_password: z.string().min(8, {
      message: "Senha deve ter no mínimo 8 caracteres.",
    }),
    matricula: z.string().min(8, {
      message: "Matricula deve ter no mínimo 8 caracteres.",
    })
  })
  .refine((data) => data.password === data.new_password, {
    message: "As senhas devem ser iguais.",
    path: ["repetir_nova_senha"], 
  })
