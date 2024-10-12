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
import { CadStudentForm } from "./CadAlunoSchema";
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
import { Status } from "./CadFormsSchema";
import { Eye, Lock, Mail } from "lucide-react";
import { CircleNotch, EyeClosed } from "phosphor-react";
import { useToast } from "@/hooks/use-toast";

interface Curso {
  id: number;
  nome: string;
  periodos: number;
  descricao: string;
}

export const CadAlunoFormFields = () => {
  const { form, onSubmit } = CadStudentForm();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [periodos, setPeriodos] = useState<number>(1);
  const [cursoSelecionado, setCursoSelecionado] = useState<number | null>(null);
  const statusPermitidos = Object.values(Status);
  const { toast } = useToast();

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
    form.setValue("curso", value);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aluno</CardTitle>
        <CardDescription>Cadastrar um novo aluno</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[70%] sm:max-h-[80%] overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="matricula"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Matricula"
                        className="mt-1"
                        {...field}
                        type="number"
                        name="matricula"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Nome Completo"
                        className=""
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="email"
                        className=""
                        {...field}
                        type="email"
                        name="email"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Senha"
                        className="indent-6"
                        {...field}
                        type={showPassword === false ? "password" : "text"}
                      />
                      <Lock className="text-zinc-400 top-2 left-2 absolute" />
                      <Button
                        type="button"
                        variant={"outline"}
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-zinc-400 bg-zinc-100 top-0 right-0 absolute flex items-center justify-center"
                      >
                        {showPassword ? (
                          <Eye className="size-4" />
                        ) : (
                          <EyeClosed className="size-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="curso"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={handleCursoChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Curso" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Cursos</SelectLabel>
                            {cursos.map((curso) => (
                              <SelectItem
                                key={curso.id}
                                value={String(curso.id)}
                              >
                                {curso.nome}
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
              <FormField
                control={form.control}
                name="periodo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Períodos</SelectLabel>
                            {Array.from({ length: periodos }, (_, index) => (
                              <SelectItem
                                key={index + 1}
                                value={String(index + 1)}
                              >
                                {index + 1}
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
