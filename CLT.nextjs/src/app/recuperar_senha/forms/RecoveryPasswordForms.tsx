"use client"

import { z } from "zod"

export const RecoveryPasswordSchema = z.object({
  email: z.string().email({
    message: "E-mail inválido.",
  }),
})
