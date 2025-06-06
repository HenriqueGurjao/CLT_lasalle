import { useAuth } from "@/contexts/AuthProvider";
import { useEffect, useState } from "react";
import { ProjetoFinal } from "./filters.dtypes";
import fetchWithAuth from "@/utils/fetchWithAuth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleNotch } from "phosphor-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Download, Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CadProjetoFormFields } from "./cadastroProjeto/CadProjetoFormFields";
import { CadProfessorFormFields } from "./cadastroProfessor/CadProfessorFormFields";
import { CadAlunoFormFields } from "./cadastroAluno/CadAlunoFormFields";
import { CadCursoFormFields } from "./cadastrarCurso/CadCursoFormFields";
import { FilterProps } from "./Filter";
import { EditProjetoFormFields } from "./cadastroProjeto/EditProjetoFormFields";
import { usePathname } from "next/navigation";

interface ListTccsProps {
  itens_por_pagina: number;
  pagina: number;
  pesquisa?: string;
  cursos?: FilterProps[];
  anos?: number[] | null;
  projetos: ProjetoFinal[] | null;
}

export const ListTccs = ({
  itens_por_pagina,
  pagina,
  projetos,
  anos,
  cursos,
  pesquisa,
}: ListTccsProps) => {
  const [flipped, setFlipped] = useState<number | null>(null);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [projeto, setProjeto] = useState<ProjetoFinal | null>(null);
  // const [projetos, setProjetos] = useState<ProjetoFinal[] | null>(null);

  const { role } = useAuth();

  const path = usePathname();

  useEffect(() => {
    console.log("Pathname:", path);
  }, [path]);

  const handleFlip = (index: number) => {
    setFlipped(flipped === index ? null : index);
  };

  return (
    <ul className="p-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-2 ">
      {projetos ? (
        projetos.map((tcc, index) => (
          <li
            key={index}
            className="relative"
          >
            <Card className="min-h-full flex flex-col justify-between pb-2 relative group overflow-hidden">
              <CardHeader className="h-24 overflow-y-auto relative">
                <CardTitle>{tcc.titulo}</CardTitle>
              </CardHeader>

              <CardContent className="flex items-center justify-center h-72 border relative overflow-hidden">
                {tcc.banner_path ? (
                  <Image
                    src={tcc.banner_path}
                    alt={`Banner do projeto ${tcc.titulo}`}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                ) : (
                  <div className="text-center">Sem imagem</div>
                )}

                {/* Overlay animado: de cima pra baixo */}
                <div
                  className="
                      absolute inset-0 bg-white bg-opacity-90 text-black p-4 
                      opacity-0 translate-y-[-100%] 
                      group-hover:opacity-100 group-hover:translate-y-0
                      transition-all duration-300 ease-in-out 
                      flex flex-col justify-start items-start text-sm text-center
                    "
                >
                  <p>
                    <span className="font-bold">Titulo:</span> {tcc.titulo}
                  </p>
                  <p>
                    <span className="font-bold">Curso:</span> {tcc.curso_nome}
                  </p>
                  <p>
                    <span className="font-bold">Orientador:</span>{" "}
                    {tcc.orientador_nome}
                  </p>
                  <p>
                    <span className="font-bold">Data:</span>{" "}
                    {new Date(tcc.data_registro).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-bold">Curso:</span> {tcc.curso_nome}
                  </p>
                  <div className="mt-1 overflow-y-auto w-full h-full flex justify-start items-start">
                    <span className="font-bold">Tags:</span>{" "}
                    {tcc.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        className="text-xs bg-blue-700 rounded-full px-2 py-0 mr-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="w-full flex items-end">
                    <Link
                      className="border w-full"
                      href={`http://localhost:8000/api/v1/download-pdf/${tcc.id}`}
                      download
                    >
                      <Button className="borde w-full">
                        <Download />
                      </Button>
                    </Link>
                    {role == "COORDENADOR" && ["/inicio", "/gerenciar_projetos"].includes(path) && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant={"ghost"}
                              className="rounded-full cursor-pointer"
                              onClick={() => (setEdit(true), setProjeto(tcc))}
                            >
                              <Pencil />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Editar</DialogTitle>
                            </DialogHeader>
                            <Tabs
                              defaultValue="projeto"
                              className="sm:max-w-3xl max-h-[90%] sm:max-h-[70%]"
                            >
                              <TabsList
                                className={`"flex w-full ${
                                  role === "COORDENADOR"
                                    ? "grid-cols-5"
                                    : "grid-cols-1"
                                }"`}
                              >
                                {role === "COORDENADOR" && <></>}
                                <TabsTrigger
                                  className="w-full"
                                  value="projeto"
                                >
                                  Projeto
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="projeto">
                                {isEdit ? (
                                  <EditProjetoFormFields
                                    isEdit={isEdit}
                                    projeto={projeto}
                                  />
                                ) : (
                                  <CadProjetoFormFields
                                    isEdit={isEdit}
                                    projeto={projeto}
                                  />
                                )}
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant={"ghost"}
                              className="rounded-full cursor-pointer"
                              onClick={() => (setEdit(true), setProjeto(tcc))}
                            >
                              <Trash />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>{tcc.titulo}</DialogTitle>
                            </DialogHeader>
                            <Tabs
                              defaultValue="projeto"
                              className="sm:max-w-3xl max-h-[90%] sm:max-h-[70%]"
                            >
                              <TabsList
                                className={`"flex w-full ${
                                  role === "COORDENADOR"
                                    ? "grid-cols-5"
                                    : "grid-cols-1"
                                }"`}
                              >
                                {role === "COORDENADOR" && <></>}
                                <TabsTrigger
                                  className="w-full"
                                  value="projeto"
                                >
                                  Tem certeza que deseja excluir?
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="projeto" className="flex justify-center gap-3">
                                <Button
                                  variant={"default"}
                                  onClick={async () => {
                                    const response = await fetchWithAuth(
                                      `http://localhost:8000/api/v1/coordenador/professor/projeto-final/${tcc.id}`,
                                      {
                                        method: "DELETE",
                                        credentials: "include",
                                      }
                                    );
                                    if (response && response.ok) {
                                      window.location.reload();
                                    } else {
                                      console.error("Erro ao excluir o projeto");
                                    }
                                  }}
                                >
                                  Sim
                                </Button>
                                <Button
                                  variant={"destructive"}
                                  onClick={() => (setEdit(false), setProjeto(null))}
                                >
                                  Não
                                </Button>
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* </Link> */}
          </li>
        ))
      ) : (
        <div className="fixed top-1/2 left-1/2">
          <CircleNotch
            size={32}
            className="text-yellow-500 animate-spin"
          />
        </div>
      )}
    </ul>
  );
};
