import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth.provider";

type AuthenticateInput = {
  email: string,
  password: string
}

export default function AuthRoute() {
  const [error, setError] = useState<string | null>(null);
  const {
    authenticate
  } = useAuth();
  const {
    register,
    handleSubmit,
  } = useForm<AuthenticateInput>();

  const onSubmit: SubmitHandler<AuthenticateInput> = (data) => {
    authenticate(data.email, data.password).catch(err => {
      setError((err as Error).message);
    });
  }

  return (
    <div className="m-auto w-[400px] mt-8">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>login</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              {error ?
                <div className="p-2 mb-2 border border-red-500 rounded bg-red-500/10">
                  <p className="text-red-200">{error}</p>
                </div> : null
              }
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Input {...register("email", { required: true, pattern: /^.+@.+/ })} placeholder="email address..." />
                <Input {...register("password", { required: true })} type="password" placeholder="password..." />
                <Button variant="outline" type="submit" className="w-full">login</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <p>register section</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

