"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthForm } from "./forms/AuthSchema";

export default function Auth() {
  const { form, onSubmit } = AuthForm();

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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
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
                            type="password"
                          />
                          <Lock className="text-zinc-400 top-2 left-2 absolute" />
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
            {/* <div className="relative">
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
            <Button
              onClick={(e) => handleSubmit(e)}
              className="w-full bg-cyan-800"
            >
              Entrar
            </Button> */}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
