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
import { useResetPassword } from "./forms/ResetPasswordSchma";
import { Suspense, useEffect, useState } from "react";
import { Eye, Lock, Mail } from "lucide-react";
import { CircleNotch, EyeClosed } from "phosphor-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RedefinirSenha() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); 
  const { form, onSubmit, formLoading } = useResetPassword(token);
  const { loading } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

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
        <h2 className="text-xl font-semibold text-gray-800">Carregando...</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Estamos processando sua solicitação. Por favor, aguarde.
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
          <h2 className="text-xl font-semibold text-gray-800">Senha redefinida com sucesso!</h2>
          <p className="text-gray-500 text-sm max-w-sm">
            Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login em breve.
          </p>
        </div>
      </div>
    );
  }
  
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
              <CardTitle>Redefinir senha</CardTitle>
              <CardDescription>
                Insira sua nova senha
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="token"
                              className="indent-6"
                              {...field}
                              type={"text"}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                <FormField
                    control={form.control}
                    name="new_password"
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
                <FormField
                    control={form.control}
                    name="new_password_confirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Repita a sua nova senha"
                              className="indent-6"
                              {...field}
                              type={showPassword === false ? "password" : "text"}
                            />
                            <Lock className="text-zinc-400 top-2 left-2 absolute" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-cyan-800 text-white">
                    Alterar senha
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
  );
}
