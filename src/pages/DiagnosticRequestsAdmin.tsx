import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminAuth from "@/components/admin/AdminAuth";
import DiagnosticRequestsAdmin from "@/components/admin/DiagnosticRequestsAdmin";

const DiagnosticRequestsAdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <AdminAuth onAuthenticated={() => {}} redirectPath="/admin-setup">
            <DiagnosticRequestsAdmin />
          </AdminAuth>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DiagnosticRequestsAdminPage;