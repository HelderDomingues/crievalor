
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

  // We're not going to use dangerouslySetInnerHTML anymore
  // as it can cause cursor positioning issues
  const renderContent = () => {
    const commonProps = {
      className: isEditing 
        ? `${className} outline-none border-b-2 border-primary focus:border-primary cursor-text` 
        : `${className} hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 cursor-pointer transition-all duration-200`
    };
    
    // For editable mode, don't use dangerouslySetInnerHTML
    const editableProps = {
      ...commonProps,
      ref: textRef,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      // We'll let the browser handle cursor positioning naturally
    };
    
    const displayProps = {
      ...commonProps,
      onDoubleClick: handleDoubleClick,
    };
    
    // Use children instead of dangerouslySetInnerHTML
    const renderElement = (props: any) => {
      const finalProps = isEditing ? editableProps : displayProps;
      
      switch (as) {
        case "h1": return <h1 {...finalProps}>{text}</h1>;
        case "h2": return <h2 {...finalProps}>{text}</h2>;
        case "h3": return <h3 {...finalProps}>{text}</h3>;
        case "h4": return <h4 {...finalProps}>{text}</h4>;
        case "h5": return <h5 {...finalProps}>{text}</h5>;
        case "h6": return <h6 {...finalProps}>{text}</h6>;
        case "span": return <span {...finalProps}>{text}</span>;
        case "p":
        default: return <p {...finalProps}>{text}</p>;
      }
    };
    
    return renderElement({});
  };

  // Add an event listener to update the text state when the content changes
  useEffect(() => {
    const currentRef = textRef.current;
    
    const handleInput = () => {
      if (currentRef) {
        setText(currentRef.textContent || "");
      }
    };
    
    if (isEditing && currentRef) {
      currentRef.addEventListener("input", handleInput);
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("input", handleInput);
      }
    };
  }, [isEditing]);

  return renderContent();
};

export default EditableText;
