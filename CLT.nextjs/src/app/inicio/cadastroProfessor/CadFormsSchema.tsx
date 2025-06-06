"use client"
 
import { z } from "zod"

export enum Status {
  PROFESSOR = "PROFESSOR",
  COORDENADOR = "COORDENADOR",
  COORDENADOR_ADJUNTO = "COORDENADOR ADJUNTO",
  PROFESSOR_ADJUNTO = "PROFESSOR ADJUNTO",
  PROFESSOR_SUBSTITUTO = "PROFESSOR SUBSTITUTO"
}

export enum Titulacao {
  MESTRADO = "MESTRADO",
  DOUTORADO = "DOUTORADO",
  BACHARELADO = "BACHARELADO",
  LICENCIATURA = "LICENCIATURA",
}
 
export const CadTeacherFormSchema = z.object({
  matricula: z.string().min(8, {
    message: "Matricula deve ter no mínimo 8 caracteres.",
  }).refine((val) => val.startsWith("00700"), {
    message: "A matrícula deve começar com '00700'.",
  }),
  nome: z.string().min(1, {
    message: "Nome não pode ser vazio.",
  }),
  email: z.string().email({
    message: "Não é um e-mail válido.",
  }).refine((val) => val.startsWith("prof."), {
    message: "O email deve começar com 'prof.'.",
  }),
  status: z.enum([Status.COORDENADOR, Status.COORDENADOR_ADJUNTO, Status.PROFESSOR, Status.PROFESSOR_ADJUNTO, Status.PROFESSOR_SUBSTITUTO], {
    required_error: "Status é obrigatório.",
  }).default(Status.PROFESSOR),
  senha: z.string().min(8, {
    message: "Senha deve ter no mínimo 8 caracteres.",
  }),
  curso: z.string().min(1, {
    message: "Curso é obrigatório.",
  }),
  departamento: z.string().min(1, {
    message: "Departamento é obrigatório.",
  }),
  titulacao: z.enum([Titulacao.BACHARELADO, Titulacao.DOUTORADO, Titulacao.LICENCIATURA, Titulacao.MESTRADO], {
    required_error: "Titulação é obrigatório.",
  }).default(Titulacao.MESTRADO),
  funcao: z.string().min(1, {
    message: "funcao é obrigatório.",
  }),
  ativo: z.boolean().default(false),
});
