
import React from 'react';
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminAuth from "@/components/admin/AdminAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminSettings = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Configurações do Sistema</h1>
          
          <AdminAuth 
            onAuthenticated={() => {}}
            redirectPath="/admin-setup"
          >
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                  <CardDescription>
                    Página de configurações do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Configurações em breve disponíveis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </AdminAuth>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminSettings;
