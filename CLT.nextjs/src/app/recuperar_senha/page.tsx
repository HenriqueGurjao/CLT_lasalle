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
import { useRouter } from "next/navigation";

export default function RecuperarSenha() {
  const { form, onSubmit, formLoading } = useRecoveryPassword();
  const { loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    
  }, [formLoading]);

  useEffect(() => {
    if (formLoading === false) {
      const timeout = setTimeout(() => {
        router.push("/auth");
      }, 5000); 
  
      return () => clearTimeout(timeout);
    }
  }, [formLoading, router]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if(formLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-800 border-opacity-50" />
        <h2 className="text-xl font-semibold text-gray-800">Enviando e-mail...</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Estamos processando sua solicitação. Por favor, aguarde enquanto enviamos o link de recuperação de senha para seu e-mail.
        </p>
      </div>
    </div>
    );
  }
  if (formLoading === false) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white px-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2l4 -4M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10 -10 10z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800">E-mail enviado com sucesso!</h2>
          <p className="text-gray-500 text-sm max-w-sm">
            Verifique sua caixa de entrada. Enviamos um link para redefinir sua senha.
            Se não encontrar, confira sua pasta de spam ou lixo eletrônico.
          </p>
        </div>
      </div>
    );
  }


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
