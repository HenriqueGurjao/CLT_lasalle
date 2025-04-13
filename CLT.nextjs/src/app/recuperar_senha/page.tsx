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
import { useAuth } from "@/contexts/AuthProvider";
import { useRecoveryPassword } from "./forms/RecoveryPasswordSchma";
import { useEffect } from "react";

export default function RecuperarSenha() {
  const { form, onSubmit, formLoading } = useRecoveryPassword();
  const { loading } = useAuth();

  useEffect(() => {
    
  }, [formLoading]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if(formLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p>Enviando...</p>
      </div>
    );
  }
  if (formLoading === false) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p>Email enviado com sucesso!</p>
      </div>
    );
  }

  console.log(formLoading)

  return (
    <section className="h-full w-full flex justify-center items-center md:items-start gap-2">
      <div className="flex items-start justify-center w-full md:w-1/3 p-2 lg:p-14">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Redefinir senha</CardTitle>
            <CardDescription>
              Insira seu e-mail para receber um link de redefinição de senha.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="E-mail de recuperação"
                            className="indent-0"
                            type={"text"}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-cyan-800 text-white">
                  Enviar email
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
