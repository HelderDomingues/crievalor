
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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Set cursor at the end
      inputRef.current.selectionStart = inputRef.current.value.length;
      inputRef.current.selectionEnd = inputRef.current.value.length;
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    finishEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      finishEditing();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setText(initialText);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const finishEditing = () => {
    setIsEditing(false);
    if (onSave && text !== initialText) {
      onSave(text);
    }
  };

  // Use React.createElement for dynamic component rendering
  const Component = as;

  if (isEditing) {
    // Use textarea instead of contentEditable div for better cursor control
    return (
      <textarea
        ref={inputRef}
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} outline-none border-b-2 border-primary focus:border-primary cursor-text w-full resize-none overflow-hidden`}
        style={{ 
          height: 'auto',
          minHeight: '1.5em'
        }}
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
