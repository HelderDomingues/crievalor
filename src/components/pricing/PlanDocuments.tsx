
import React from "react";
import { DocumentType } from "./types";

interface PlanDocumentsProps {
  documents: (DocumentType | { type: DocumentType; available: boolean })[];
}

const PlanDocuments: React.FC<PlanDocumentsProps> = ({ documents }) => {
  if (!documents || documents.length === 0) return null;

  // Filter out documents not available and map to correct format
  const availableDocuments = documents
    .filter(doc => {
      // Handle both formats of documents
      if ('type' in doc && 'available' in doc) {
        return doc.available;
      }
      return true; // If it's just DocumentType, assume it's available
    })
    .map(doc => {
      if ('type' in doc && 'available' in doc) {
        return doc.type;
      }
      return doc;
    });

  return (
    <div className="mb-4">
      <h4 className="mb-3 border-b border-border pb-2 text-sm font-bold">Documentos Incluídos</h4>
      <ul className="space-y-3">
        {availableDocuments.map((doc, index) => {
          const Icon = doc.icon;
          return (
            <li key={index} className="flex items-center text-sm">
              {Icon && <Icon className="h-4 w-4 text-primary mr-2" />}
              <span>{doc.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PlanDocuments;
