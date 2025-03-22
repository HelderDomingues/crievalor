
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
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    // Focus the editable element and place cursor at the end when entering edit mode
    if (isEditing && textRef.current) {
      textRef.current.focus();
      
      // Place cursor at the end of the text
      const range = document.createRange();
      const selection = window.getSelection();
      
      if (textRef.current.childNodes.length > 0) {
        range.setStart(textRef.current.childNodes[0], text.length);
        range.collapse(true);
        
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  }, [isEditing, text]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onSave && text !== initialText) {
      onSave(text);
    }
  };

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

  // Render the appropriate tag based on the 'as' prop
  const renderContent = () => {
    const commonProps = {
      className: isEditing 
        ? `${className} outline-none border-b-2 border-primary focus:border-primary cursor-text` 
        : `${className} hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 cursor-pointer transition-all duration-200`
    };
    
    const editableProps = {
      ...commonProps,
      ref: textRef,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      onInput: (e: React.FormEvent<HTMLDivElement>) => 
        setText((e.target as HTMLDivElement).innerText),
      dangerouslySetInnerHTML: { __html: text }
    };
    
    const displayProps = {
      ...commonProps,
      onDoubleClick: handleDoubleClick,
      children: text
    };
    
    const props = isEditing ? editableProps : displayProps;
    
    switch (as) {
      case "h1": return <h1 {...props} />;
      case "h2": return <h2 {...props} />;
      case "h3": return <h3 {...props} />;
      case "h4": return <h4 {...props} />;
      case "h5": return <h5 {...props} />;
      case "h6": return <h6 {...props} />;
      case "span": return <span {...props} />;
      case "p":
      default: return <p {...props} />;
    }
  };

  return renderContent();
};

export default EditableText;
