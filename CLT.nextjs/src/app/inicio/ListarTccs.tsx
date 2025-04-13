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


interface ListTccsProps {
  itens_por_pagina: number;
  pagina: number;
  pesquisa?: string;
  cursos?: string[];
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
  // const [projetos, setProjetos] = useState<ProjetoFinal[] | null>(null);

  const { user } = useAuth();

  const handleFlip = (index: number) => {
    setFlipped(flipped === index ? null : index);
  };

  return (
    <ul className="p-4 grid grid-cols-5 gap-2 ">
      {projetos ? (
        projetos.map((tcc, index) => (
          <li key={index} className="relative">
              <Card className="min-h-full flex flex-col justify-between pb-2 relative group overflow-hidden">
                <CardHeader className="h-28 overflow-y-auto">
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
                      absolute inset-0 bg-white bg-opacity-70 text-black p-4 
                      opacity-0 translate-y-[-100%] 
                      group-hover:opacity-100 group-hover:translate-y-0
                      transition-all duration-300 ease-in-out 
                      flex flex-col justify-center items-center text-sm text-center
                    "
                  >
                    <p>
                      <span className="font-bold">Ano:</span> {tcc.data_registro}
                    </p>
                    <p>
                      <span className="font-bold">Curso:</span> {tcc.curso_nome}
                    </p>
                    <Link className="border" href={`http://localhost:8000/api/v1/download-pdf/${tcc.id}`} download>
                      <Button className="border">
                        Clique aqui para baixar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            {/* </Link> */}
          </li>

        ))
      ) : (
        <div className="fixed top-1/2 left-1/2">
          <CircleNotch size={32} className="text-yellow-500 animate-spin"/>
        </div>
      )}
    </ul>
  );
};
