
import React, { useState, useEffect, useRef } from "react";

interface EditableTextProps {
  initialText: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  onSave?: (text: string) => void;
}

const EditableText: React.FC<EditableTextProps> = ({
  initialText,
  className = "",
  as = "p",
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  // Lida com duplo clique para iniciar edição
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // Lida com a perda de foco para salvar
  const handleBlur = () => {
    setIsEditing(false);
    if (onSave && text !== initialText) {
      onSave(text);
    }
  };

  // Lida com teclas Enter para salvar e Escape para cancelar
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);
      if (onSave && text !== initialText) {
        onSave(text);
      }
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setText(initialText);
    }
  };

  // Renderiza baseado no tipo do elemento
  const renderElement = () => {
    if (isEditing) {
      return React.createElement(
        as,
        {
          ref: elementRef,
          className: `${className} outline-none border-b-2 border-primary focus:border-primary cursor-text`,
          contentEditable: true,
          suppressContentEditableWarning: true,
          onBlur: handleBlur,
          onKeyDown: handleKeyDown,
          onInput: (e: React.FormEvent<HTMLElement>) => {
            const target = e.target as HTMLElement;
            setText(target.textContent || "");
          },
          dangerouslySetInnerHTML: { __html: text }
        }
      );
    }

    return React.createElement(
      as,
      {
        ref: elementRef,
        className: `${className} hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 cursor-pointer transition-all duration-200`,
        onDoubleClick: handleDoubleClick,
      },
      text
    );
  };

  return renderElement();
};

export default EditableText;
