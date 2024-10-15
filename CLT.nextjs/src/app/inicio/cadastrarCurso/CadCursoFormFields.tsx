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
import { useEffect, useState } from "react";
import fetchWithAuth from "@/utils/fetchWithAuth";
import { Eye, Lock, Mail } from "lucide-react";
import { CircleNotch, EyeClosed } from "phosphor-react";
import { CadCursoForm } from "./CadCursoSchema";

interface Curso {
  id: number;
  nome: string;
  periodos: number;
  descricao: string;
}

export const CadCursoFormFields = () => {
  const { form, onSubmit } = CadCursoForm();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [periodos, setPeriodos] = useState<number>(1);
  const [cursoSelecionado, setCursoSelecionado] = useState<number | null>(null);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Curso</CardTitle>
        <CardDescription>Cadastrar um novo urso</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[70%] sm:max-h-[80%] overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Nome do curso"
                        className="mt-1"
                        {...field}
                        type="text"
                        name="nome"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Breve descrição do curso"
                        className=""
                        {...field}
                        type="text"
                        name="descricao"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="periodo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Duracao do curso em periodos"
                        className=""
                        {...field}
                        type="number"
                        name="periodo"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-cyan-800"
            >
              Cadastrar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
