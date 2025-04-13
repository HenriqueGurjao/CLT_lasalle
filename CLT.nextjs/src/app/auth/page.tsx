"use client";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, Lock, Mail } from "lucide-react";
import { CircleNotch, EyeClosed } from "phosphor-react";
import { AuthForm } from "./forms/AuthSchema";
import { useAuth } from "@/contexts/AuthProvider";
import { useState } from "react";
import Image from 'next/image';
import Link from "next/link";

export default function Auth() {
  const { form, onSubmit } = AuthForm();
  const { loading } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  if (loading) {
    <div className="h-full w-full flex items-center justify-center">
      <CircleNotch className="text-yellow-500 size-10 animate-spin" />
    </div>;
  }

  return (
    <section className=" h-full w-full flex justify-between items-center md:items-start gap-2">
      <div className=" border bg-blue-400 w-1/2 hidden h-full md:w-2/3 md:flex justify-center items-center">
        <Image
          src="/imagem/Login_TCC.jpg"
          alt="imagem tela de login" 
          width={1000}   
          height={300} 
        />
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
                            className="indent-6"
                            {...field}
                            type="number"
                            name="matricula"
                          />
                          <Mail className="text-zinc-400 top-2 left-2 absolute" />
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
                <Button
                  type="submit"
                  className="w-full bg-cyan-800"
                >
                  Entrar
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Link href="/recuperar_senha" className=" underline ">
              Esqueceu sua senha?
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
