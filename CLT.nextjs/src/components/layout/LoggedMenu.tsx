"use client";

import { CadCursoFormFields } from "@/app/inicio/cadastrarCurso/CadCursoFormFields";
import { CadAlunoFormFields } from "@/app/inicio/cadastroAluno/CadAlunoFormFields";
import { CadProfessorFormFields } from "@/app/inicio/cadastroProfessor/CadProfessorFormFields";
import { CadProjetoFormFields } from "@/app/inicio/cadastroProjeto/CadProjetoFormFields";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardFooter,
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagnifyingGlass } from "phosphor-react";
import React, { useState } from "react";

interface LoggedMenuProps {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  fetchProjetos: () => Promise<void>;
  setCurrentPage: (page:number) => void;
}
export const LoggedMenu = ({
  searchInput,
  setSearchInput,
  fetchProjetos,
  setCurrentPage
}: LoggedMenuProps) => {
  const path = usePathname();

  const { role } = useAuth();

  return (
    <>
      {path != "/auth" && path != "/" && (
        <div className="w-ful border p-2 flex justify-between bg-blue-700 rounded-t-md dark:bg-gray-800">
          <ul className="flex gap-3 items-center">
            {/* <li>
              <Link
                className="hover:underline"
                href={"/inicio"}
              >
                Catalogo
              </Link>
            </li>
            <li>
              <Link
                className="hover:underline"
                href={"/meus-projetos"}
              >
                Meus projetos
              </Link>
            </li>
            <li>
              <Link
                className="hover:underline"
                href={"/gerenciar-projetos"}
              >
                Gerenciar Projetos
              </Link>
            </li> */}
          </ul>
          <ul className="flex gap-3">
            <li className="flex items-center gap-2">
              <Input
                className="h-8"
                placeholder="Campo de buscas"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button
                variant={"outline"}
                className="p-0 flex rounded-full w-12"
                onClick={(() => {
                  fetchProjetos()
                  setCurrentPage(1)
                })}
              >
                <MagnifyingGlass
                  size={16}
                  className=""
                />
              </Button>
            </li>
            <li>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Cadastrar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Cadastrar</DialogTitle>
                  </DialogHeader>
                  <Tabs
                    defaultValue="projeto"
                    className="sm:max-w-3xl max-h-[90%] sm:max-h-[70%]"
                  >
                    <TabsList
                      className={`"flex w-full ${
                        role === "COORDENADOR" ? "grid-cols-5" : "grid-cols-1"
                      }"`}
                    >
                      {role === "COORDENADOR" && <></>}
                      <TabsTrigger
                        className="w-full"
                        value="projeto"
                      >
                        Projeto
                      </TabsTrigger>
                      <TabsTrigger
                        className="w-full"
                        value="professor"
                      >
                        Professor
                      </TabsTrigger>
                      <TabsTrigger
                        className="w-full"
                        value="curso"
                      >
                        Curso
                      </TabsTrigger>
                      <TabsTrigger
                        className="w-full"
                        value="aluno"
                      >
                        Aluno
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="projeto">
                      <CadProjetoFormFields />
                    </TabsContent>
                    <TabsContent
                      value="professor"
                      className=" pb-1 overflow-y-auto"
                    >
                      <CadProfessorFormFields />
                    </TabsContent>
                    <TabsContent value="aluno">
                      <CadAlunoFormFields />
                    </TabsContent>
                    <TabsContent value="curso">
                      <CadCursoFormFields />
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};
