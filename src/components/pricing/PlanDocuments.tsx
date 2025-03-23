
import React from "react";
import { ElementType } from "react";

interface DocumentType {
  icon: ElementType;
  name: string;
  included: boolean;
}

interface PlanDocumentsProps {
  documents: DocumentType[];
}

const PlanDocuments = ({ documents }: PlanDocumentsProps) => {
  return (
    <div className="mb-8">
      <h4 className="text-sm font-medium mb-3 border-b border-border pb-2">Documentos Incluídos</h4>
      <ul className="space-y-3">
        {documents.map((doc, i) => (
          <li key={i} className="flex items-start">
            <div className={`shrink-0 mr-2 h-5 w-5 mt-0.5 ${doc.included ? 'text-green-500' : 'text-muted-foreground opacity-50'}`}>
              <doc.icon className="h-5 w-5" />
            </div>
            <span className={`text-sm ${doc.included ? '' : 'text-muted-foreground line-through opacity-50'}`}>
              {doc.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanDocuments;
