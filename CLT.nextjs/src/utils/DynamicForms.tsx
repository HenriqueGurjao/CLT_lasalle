import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FC } from "react";
import { useForm, FieldValues } from "react-hook-form";

interface FormFieldConfig {
  name: string;
  placeholder: string;
  type: string;
  options?: { value: string; label: string }[];
}

interface DynamicFormProps {
  formConfig: FormFieldConfig[];
  onSubmit: (data: FieldValues) => void; // Ajuste o tipo de dados conforme necessário
}

const DynamicForm: FC<DynamicFormProps> = ({ formConfig, onSubmit }) => {
  const form = useForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 pt-1"
      >
        {formConfig.map((fieldConfig) => (
          <FormField
            key={fieldConfig.name}
            control={form.control}
            name={fieldConfig.name}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  {fieldConfig.type === "select" ? (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={fieldConfig.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{fieldConfig.placeholder}</SelectLabel>
                          {fieldConfig.options?.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder={fieldConfig.placeholder}
                      type={fieldConfig.type}
                      {...field}
                    />
                  )}
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        ))}
        <Button
          type="submit"
          className="w-full bg-cyan-800"
        >
          Cadastrar
        </Button>
      </form>
    </Form>
  );
};

export default DynamicForm;
