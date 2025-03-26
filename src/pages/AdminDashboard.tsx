
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminAuth from "@/components/admin/AdminAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, BriefcaseIcon, WebhookIcon, FileTextIcon } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminModules = [
    {
      title: "Portfólio",
      description: "Gerenciar projetos e trabalhos no portfólio",
      icon: <BriefcaseIcon className="h-8 w-8 text-blue-500" />,
      path: "/portfolio-admin"
    },
    {
      title: "Webhooks",
      description: "Gerenciar webhooks para integrações",
      icon: <WebhookIcon className="h-8 w-8 text-green-500" />,
      path: "/admin-webhooks"
    },
    {
      title: "Materiais",
      description: "Gerenciar materiais exclusivos",
      icon: <FileTextIcon className="h-8 w-8 text-purple-500" />,
      path: "/admin-materials"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>
          
          <AdminAuth 
            onAuthenticated={() => {}}
            redirectPath="/admin-setup"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {adminModules.map((module, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      {module.icon}
                      <CardTitle>{module.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{module.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => navigate(module.path)}
                    >
                      Acessar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </AdminAuth>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
