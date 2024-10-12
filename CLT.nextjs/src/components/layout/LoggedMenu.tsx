"use client"

import { CadAlunoFormFields } from "@/app/inicio/cadastroAluno/CadAlunoFormFields";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription, CardFooter, Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const LoggedMenu = () => {
  const path = usePathname();

  return (
    <>
      {path != "/auth" && path != "/" && (
        <div className="w-ful border p-2 flex justify-between">
          <ul className="flex gap-3">
            <li>
              <Link
                className="hover:underline"
                href={"/inicio"}
              >
                Catalogo
              </Link>
            </li>
            <li>
              <Link
                className="hover:underline"
                href={"/meus-tcc"}
              >
                Meus TCC
              </Link>
            </li>
          </ul>
          <ul className="flex gap-3">
            <li>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Cadastrar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl max-h-[70%] sm:max-h-[80%] ">
                  <DialogHeader>
                    <DialogTitle>Cadastrar</DialogTitle>
                  </DialogHeader>
                  <Tabs
                    defaultValue="projeto"
                    className="sm:max-w-3xl max-h-[70%] sm:max-h-[80%]"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="projeto">Projeto</TabsTrigger>
                      <TabsTrigger value="professor">Professor</TabsTrigger>
                      <TabsTrigger value="aluno">Aluno</TabsTrigger>
                    </TabsList>
                    <TabsContent value="projeto">
                      <CadAlunoFormFields/>
                    </TabsContent>
                    <TabsContent value="professor" className=" max-h-[70%] sm:max-h-[80%] overflow-y-auto">
                      <Card>
                        <CardHeader>
                          <CardTitle>professor</CardTitle>
                          <CardDescription>
                            Change your professor here. After saving, you'll be
                            logged out.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 max-h-[70%] sm:max-h-[80%] overflow-y-auto">
                          <div className="space-y-1">
                            <Label htmlFor="current">Current professor</Label>
                            <Input
                              id="current"
                              type="professor"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="new">New professor</Label>
                            <Input
                              id="new"
                              type="professor"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="current">Current professor</Label>
                            <Input
                              id="current"
                              type="professor"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="new">New professor</Label>
                            <Input
                              id="new"
                              type="professor"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="current">Current professor</Label>
                            <Input
                              id="current"
                              type="professor"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="new">New professor</Label>
                            <Input
                              id="new"
                              type="professor"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="current">Current professor</Label>
                            <Input
                              id="current"
                              type="professor"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="new">New professor</Label>
                            <Input
                              id="new"
                              type="professor"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="current">Current professor</Label>
                            <Input
                              id="current"
                              type="professor"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="new">New professor</Label>
                            <Input
                              id="new"
                              type="professor"
                            />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button>Cadastrar</Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    <TabsContent value="aluno">
                      <CadAlunoFormFields/>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};