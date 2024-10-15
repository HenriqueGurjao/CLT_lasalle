import { z } from "zod";

export const FileSchema = z
  .instanceof(File) 
  .refine((file) => file.size <= 100 * 1024 * 1024, { 
    message: "O arquivo deve ter no máximo 5MB.",
  })
  .refine((file) => ["image/jpeg", "image/png", "application/pdf"].includes(file.type), {
    message: "Formato de arquivo inválido. Os formatos aceitos são JPEG, PNG e PDF.",
  });