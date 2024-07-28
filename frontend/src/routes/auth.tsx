import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function AuthRoute() {
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
              <CardTitle>account</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <p>test</p>
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

