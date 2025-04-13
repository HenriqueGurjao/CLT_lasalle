"use client"

import { z } from "zod"

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "E-mail inválido.",
  }),
})
