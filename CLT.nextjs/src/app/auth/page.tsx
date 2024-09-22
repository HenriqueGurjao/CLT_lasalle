"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Auth() {

  const [login, setLogin] = useState<number>();
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ matricula: login, senha: password }),
      });

      if (!response.ok) {
        response.status === 400 && alert('Senha inválida');
        response.status === 404 && alert('Usuário não encontrado');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      router.push('/inicio');
    } catch (error) {
      alert('Erro interno no servidor'+ error);
    }
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  }

  const handleLoginChange = (event: any) => {
    setLogin(event.target.value);
  }


  return (
    <section className=" h-full w-full flex justify-between items-center md:items-start gap-2">
      <div className=" border bg-blue-400 w-1/2 hidden h-full md:w-2/3 md:flex justify-center items-center">
        Imagem
      </div>
      <div className="flex items-start justify-center w-full md:w-1/3 p-2 lg:p-14">
        <Card className="w-full">
          <CardHeader className="flex">
            <div className="flex justify-center">UniLaSalle</div>
            <div>
              <CardTitle>Acesso de usuários</CardTitle>
              <CardDescription>
                Centro universitario La Salle do Rio de Janeiro
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="relative">
              <Input
                type="number"
                placeholder="Usuário"
                className="pl-10"
                value={login}
                onChange={(event) => handleLoginChange(event)}
              />
              <Mail className="text-zinc-400 top-2 left-2 absolute" />
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="Senha"
                className="pl-10"
                value={password}
                onChange={(event) => handlePasswordChange(event)}
              />
              <Lock className="text-zinc-400 top-2 left-2 absolute" />  
            </div>
            <Button onClick={(e) => handleSubmit(e)} className="w-full bg-cyan-800">Entrar</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
