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
import { useState } from "react";
import { Eye, Lock, Mail } from "lucide-react";
import { CircleNotch, EyeClosed } from "phosphor-react";

export default function RedefinirSenha() {
  const { form, onSubmit } = useResetPassword();
  const { loading } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
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
