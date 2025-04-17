
import React from "react";
import { DocumentType } from "./types";

interface PlanDocumentsProps {
  documents: DocumentType[];
}

const PlanDocuments: React.FC<PlanDocumentsProps> = ({ documents }) => {
  if (!documents || documents.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="mb-3 border-b border-border pb-2 text-sm font-bold">Documentos Incluídos</h4>
      <ul className="space-y-3">
        {documents.map((doc, index) => {
          const Icon = doc.icon;
          return (
            <li key={index} className="flex items-center text-sm">
              {Icon && <Icon className={`h-4 w-4 ${doc.included ? 'text-primary' : 'text-muted-foreground'} mr-2`} />}
              <span className={doc.included ? '' : 'text-muted-foreground line-through relative'}>
                {doc.name}
                {!doc.included && (
                  <span className="absolute inset-0 border-t border-red-500" style={{ transform: 'translateY(10px)' }}></span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PlanDocuments;
