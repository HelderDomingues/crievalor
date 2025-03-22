
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
  const textRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

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

  // Use a dynamic component approach that correctly handles the ref type
  const Component = as as keyof JSX.IntrinsicElements;

  return (
    <>
      {isEditing ? (
        <Component
          ref={textRef as any}
          contentEditable
          suppressContentEditableWarning
          className={`${className} outline-none border-b-2 border-primary focus:border-primary cursor-text`}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onInput={(e) => setText((e.target as HTMLElement).innerText)}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ) : (
        <Component
          className={`${className} hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 cursor-pointer transition-all duration-200`}
          onDoubleClick={handleDoubleClick}
        >
          {text}
        </Component>
      )}
    </>
  );
};

export default EditableText;
