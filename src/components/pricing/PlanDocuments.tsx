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

const PlanDocuments = ({
  documents
}: PlanDocumentsProps) => {
  // Separate main planning document from other documents for hierarchy
  const mainPlanningDocuments = documents.filter(doc => doc.name.includes("Plano Estratégico"));
  const otherDocuments = documents.filter(doc => !doc.name.includes("Plano Estratégico"));
  
  return (
    <div>
      {/* Main planning documents - top level in hierarchy */}
      <ul className="space-y-3 mb-4">
        {mainPlanningDocuments.map((doc, i) => (
          <li key={`main-${i}`} className="flex items-start">
            <div className={`shrink-0 mr-2 h-5 w-5 mt-0.5 ${doc.included ? 'text-green-500' : 'text-muted-foreground opacity-50'}`}>
              <doc.icon className="h-5 w-5" />
            </div>
            <span className={`text-sm font-medium ${doc.included ? '' : 'text-muted-foreground line-through opacity-50'}`}>
              {doc.name}
            </span>
          </li>
        ))}
      </ul>
      
      {/* Other supporting documents - indented to show hierarchy */}
      <ul className="space-y-3">
        {otherDocuments.map((doc, i) => (
          <li key={`sub-${i}`} className="flex items-start">
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
