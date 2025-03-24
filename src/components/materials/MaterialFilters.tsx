
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MaterialFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const MaterialFilters: React.FC<MaterialFiltersProps> = ({ 
  activeFilter, 
  onFilterChange 
}) => {
  return (
    <div className="mt-4 md:mt-0">
      <Tabs value={activeFilter} onValueChange={onFilterChange}>
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="ebook">E-books</TabsTrigger>
          <TabsTrigger value="planilha">Planilhas</TabsTrigger>
          <TabsTrigger value="apresentacao">Apresentações</TabsTrigger>
          <TabsTrigger value="guia">Guias</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default MaterialFilters;
