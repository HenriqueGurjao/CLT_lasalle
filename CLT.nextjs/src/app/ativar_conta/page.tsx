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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import Image from "next/image"; // seu hook customizado
import { useAuth } from "@/contexts/AuthProvider";
import { useActivateAccount } from "./forms/ActivateAccountSchma";

export default function AtivarConta() {
  const { form, onSubmit } = useActivateAccount();
  const { loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <section className="h-full w-full flex justify-center items-center md:items-start gap-2">
      <div className="flex items-start justify-center w-full md:w-1/3 p-2 lg:p-14">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Ativação de Conta</CardTitle>
            <CardDescription>
              Crie sua senha para ativar sua conta UniLaSalle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* <FormField
                  control={form.control}
                  name="matricula"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Matrícula"
                            className="indent-6"
                            type="text"
                            {...field}
                          />
                          <Mail className="text-zinc-400 top-2 left-2 absolute" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Nova senha"
                            className="indent-6"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <Lock className="text-zinc-400 top-2 left-2 absolute" />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-zinc-400 bg-zinc-100 top-0 right-0 absolute"
                          >
                            {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Repetir nova senha"
                            className="indent-6"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <Lock className="text-zinc-400 top-2 left-2 absolute" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-cyan-800 text-white">
                  Ativar conta
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
