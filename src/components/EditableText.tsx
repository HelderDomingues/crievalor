
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
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      
      // Set selection range to the end of the content
      const selection = window.getSelection();
      const range = document.createRange();
      
      if (inputRef.current.childNodes.length > 0) {
        const lastChild = inputRef.current.childNodes[0];
        const length = lastChild.textContent?.length || 0;
        
        range.setStart(lastChild, length);
        range.setEnd(lastChild, length);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    finishEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finishEditing();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setText(initialText);
    }
  };

  const finishEditing = () => {
    setIsEditing(false);
    if (onSave && text !== initialText) {
      onSave(text);
    }
  };
  
  // Using a separate function to maintain cursor position
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || "";
    setText(newText);
  };

  const Component = as;

  if (isEditing) {
    return (
      <div
        ref={inputRef}
        className={`${className} outline-none border-b-2 border-primary focus:border-primary cursor-text`}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }

  return (
    <Component
      className={`${className} hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 cursor-pointer transition-all duration-200`}
      onDoubleClick={handleDoubleClick}
    >
      {text}
    </Component>
  );
};

export default EditableText;
