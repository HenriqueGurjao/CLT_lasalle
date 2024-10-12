import { useAuth } from "@/contexts/AuthProvider";
import { useEffect, useState } from "react";
import { ProjetoFinal } from "./filters.dtypes";
import fetchWithAuth from "@/utils/fetchWithAuth";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ListTccs = () => {
  const [flipped, setFlipped] = useState<number | null>(null);
  const [projetos, setProjetos] = useState<ProjetoFinal[] | null>(null);

  const { user } = useAuth();

  const handleFlip = (index: number) => {
    setFlipped(flipped === index ? null : index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:8000/api/v1/projetos"
        );
        const data = await response?.json();

        setProjetos(data);
      } catch (error) {
        console.error("Error fetching tccs:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ul className="border p-4 grid grid-cols-4 gap-2">
      {projetos ? (
        projetos.map((tcc, index) => (
          <li key={index}>
            <Card className="min-h-full flex flex-col justify-between pb-2 ">
              <CardHeader className="h-28 overflow-y-auto">
                <CardTitle>{tcc.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center bg-[url('/Untitled.jpg')] h-72 bg-cover bg-center border"></CardContent>
              <CardFooter className="flex items-center justify-center gap-2 pt-5">
                <Button>Download</Button>
                <Button>Informações</Button>
              </CardFooter>
              {/* <CardFooter className="overflow-x-auto max-h-20 p-4">
              <ul>
                <li>
                  <span className="font-bold">Ano:</span>
                  {tcc.ano}
                </li>
                <li>
                  <span className="font-bold">Curso:</span>
                  {tcc.curso}
                </li>
                <li className="overflow-x-auto">
                  <span className="font-bold">Tags:</span>
                  {tcc.tags.map((tag, index) => (
                    <Badge key={index} className="ml-2">
                      {tag}
                    </Badge>
                  ))}
                </li>
              </ul>
            </CardFooter> */}
            </Card>
          </li>
        ))
      ) : (
        <div>carregando</div>
      )}
    </ul>
  );
};