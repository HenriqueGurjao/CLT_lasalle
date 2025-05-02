import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import fetchWithAuth from "@/utils/fetchWithAuth";
import { CadProjetoFormSchema, Status } from "./CadFormsSchema";
import { CadProjetoForm } from "./CadProjetoSchema";
import { PlusCircle } from "lucide-react";
import { MinusCircle } from "phosphor-react";
import { ProjetoFinal } from "../filters.dtypes";
import { EditProjetoForm } from "./EditProjetoSchema";

interface Curso {
  id: number;
  nome: string;
  periodos: number;
  descricao: string;
}

interface CadProjetoFormFieldsProps {
  projeto: ProjetoFinal | null;
  isEdit?: boolean;
}

export const EditProjetoFormFields = ({ isEdit, projeto } : CadProjetoFormFieldsProps) => {
  const { form, onSubmit } = EditProjetoForm(projeto, isEdit);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [periodos, setPeriodos] = useState<number>(1);
  const [cursoSelecionado, setCursoSelecionado] = useState<number | null>(null);
  const statusPermitidos = Object.values(Status);
  const [tags, setTags] = useState<
    { titulo: string; area_envolvida: string }[]
  >([]);

  const addTag = () => {
    setTags([...tags, { titulo: "", area_envolvida: "" }]);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const updateTag = (
    index: number,
    field: keyof { titulo: string; area_envolvida: string },
    value: string
  ) => {
    const updatedTags = [...tags];
    updatedTags[index][field] = value;
    setTags(updatedTags);
    form.setValue("tags", updatedTags);
  };

  useEffect(() => {
    async function fetchCursos() {
      try {
        const response = await fetchWithAuth(
          "http://localhost:8000/api/v1/cursos"
        );
        const data = await response?.json();
        setCursos(data);
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      }
    }

    fetchCursos();
  }, []);

  const handleCursoChange = (value: string) => {
    const cursoId = Number(value);
    setCursoSelecionado(cursoId);
    const cursoSelecionado = cursos.find((curso) => curso.id === cursoId);
    if (cursoSelecionado) {
      setPeriodos(cursoSelecionado.periodos);
    } else {
      setPeriodos(1);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Projeto</CardTitle>
        <CardDescription>Cadastrar um novo Projeto</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[70%] sm:max-h-[80%] overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Titulo"
                        className="mt-1"
                        {...field}
                        type="text"
                        name="titulo"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aluno_matr"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Matricula Aluno"
                        className="mt-1"
                        {...field}
                        type="number"
                        name="matr_aluno"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orientador_matr"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Matricula Orientador"
                        className=""
                        {...field}
                        type="number"
                        name="matr_orientador"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            {statusPermitidos.map((status) => (
                              <SelectItem
                                key={status}
                                value={status}
                              >
                                {status}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              <div className="flex items-center gap-2">
                <Label>Tags</Label>
                <Button
                  type="button"
                  onClick={addTag}
                  variant={"outline"}
                  className="rounded-full p-0 px-2"
                >
                  <PlusCircle size={24} />
                </Button>
              </div>
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex space-x-2"
                >
                  <Input
                    placeholder="Título"
                    value={tag.titulo}
                    onChange={(e) => updateTag(index, "titulo", e.target.value)}
                  />
                  <Input
                    placeholder="Área Envolvida"
                    value={tag.area_envolvida}
                    onChange={(e) =>
                      updateTag(index, "area_envolvida", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    onClick={() => removeTag(index)}
                    variant={"outline"}
                    className="rounded-full p-0 px-2"
                  >
                    <MinusCircle size={24} />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="submit"
              className="w-full bg-cyan-800"
            >
              Salvar alterações
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
