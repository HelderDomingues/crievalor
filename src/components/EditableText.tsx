
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
    // Only focus the element when entering edit mode
    if (isEditing && textRef.current) {
      textRef.current.focus();
      // Don't manipulate the cursor position - let the browser handle it naturally
    }
  }, [isEditing]);

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

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    // Update text state without manipulating cursor
    setText((e.target as HTMLDivElement).innerText);
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
      onInput: handleInput,
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
