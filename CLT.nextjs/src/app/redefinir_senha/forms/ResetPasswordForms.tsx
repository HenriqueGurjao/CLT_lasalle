"use client"

import { z } from "zod"

export const ResetPasswordSchema = z.object({
  token: z
    .string({
      required_error: "Token é obrigatório",
    })
    .min(1, { message: "Token é obrigatório" }),

  new_password: z
    .string({
      required_error: "Senha é obrigatória",
    })
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),

  new_password_confirm: z
    .string({
      required_error: "Confirmação de senha é obrigatória",
    })
    .min(8, {
      message: "Confirmação de senha deve ter pelo menos 8 caracteres",
    }),
})
.refine((data) => data.new_password === data.new_password_confirm, {
  path: ["new_password_confirm"],
  message: "As senhas não coincidem",
})
