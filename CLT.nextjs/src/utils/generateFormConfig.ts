import { FormSchemaType } from "@/app/inicio/cadastroProfessor/CadProfessorSchema";
import { z } from "zod";

interface FormFieldConfig {
  name: keyof FormSchemaType;
  placeholder: string;
  type: string;
  options?: { value: string; label: string }[]; 
}

export const generateFormConfig = (
  schema: z.ZodObject<any>
): FormFieldConfig[] => {
  const config: FormFieldConfig[] = [];

  for (const key in schema.shape) {
    const field = schema.shape[key];

    const fieldConfig: FormFieldConfig = {
      name: key as keyof FormSchemaType,
      placeholder: key.charAt(0).toUpperCase() + key.slice(1),
      type:
        field._def.typeName === "ZodString"
          ? "text"
          : field._def.typeName === "ZodEnum"
          ? "select"
          : "text",
      options:
        field._def.typeName === "ZodEnum"
          ? (field._def.values as string[]).map((value) => ({
              value,
              label: value,
            }))
          : undefined,
    };
    config.push(fieldConfig);
  }

  return config;
};
