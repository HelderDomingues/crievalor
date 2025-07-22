
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminAuth from "@/components/admin/AdminAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, FileText, Briefcase, Users, Calendar, UserCheck, Stethoscope } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <AdminAuth 
            onAuthenticated={() => {}}
            redirectPath="/admin-setup"
          >
            <h1 className="text-4xl font-bold mb-8">Painel Administrativo</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Material Exclusivo Admin */}
              <Link to="/admin-materials">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      Material Exclusivo
                    </CardTitle>
                    <CardDescription>
                      Gerenciar materiais exclusivos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Adicione, edite ou remova documentos e materiais para seus assinantes.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              
              {/* Portfolio Admin */}
              <Link to="/portfolio-admin">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="mr-2 h-5 w-5 text-primary" />
                      Portfólio
                    </CardTitle>
                    <CardDescription>
                      Gerenciar portfólio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Adicione, edite ou remova itens do seu portfólio de trabalhos.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              
              {/* Client Logos Admin */}
              <Link to="/admin-client-logos">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" />
                      Logos dos Clientes
                    </CardTitle>
                    <CardDescription>
                      Gerenciar logos de clientes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Adicione, edite ou remova logos dos clientes exibidos no carrossel.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              
              
              {/* Palestras & Eventos */}
              <Link to="/admin-lectures">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-primary" />
                      Palestras & Eventos
                    </CardTitle>
                    <CardDescription>
                      Gerenciar palestras e eventos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Crie e gerencie palestras disponíveis no sistema de captura de leads.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Leads de Palestras */}
              <Link to="/admin-event-leads">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserCheck className="mr-2 h-5 w-5 text-primary" />
                      Leads de Palestras
                    </CardTitle>
                    <CardDescription>
                      Visualizar leads capturados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Visualize e gerencie os leads capturados através das palestras.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Diagnósticos Gratuitos */}
              <Link to="/admin-diagnostic-requests">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Stethoscope className="mr-2 h-5 w-5 text-primary" />
                      Diagnósticos Gratuitos
                    </CardTitle>
                    <CardDescription>
                      Gerenciar solicitações de diagnóstico
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Visualize e gerencie as solicitações de diagnóstico gratuito.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* System Settings */}
              <Link to="/admin-settings">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5 text-primary" />
                      Configurações
                    </CardTitle>
                    <CardDescription>
                      Configurações do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Gerencie as configurações gerais do sistema e preferências.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </AdminAuth>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
