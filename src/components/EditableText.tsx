
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
  const textRef = useRef<HTMLElement>(null);

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

  // Create element based on 'as' prop
  const createElementWithRef = (
    tag: string,
    props: React.HTMLAttributes<HTMLElement>
  ) => {
    return React.createElement(tag, {
      ...props,
      ref: textRef,
    });
  };

  // Render appropriate element
  const renderEditableElement = () => {
    const baseClassName = isEditing
      ? `${className} outline-none border-b-2 border-primary focus:border-primary cursor-text`
      : `${className} hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 cursor-pointer transition-all duration-200`;

    // Common props for both states
    const commonProps = {
      className: baseClassName,
    };

    // Props specific to editing state
    const editingProps = {
      ...commonProps,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      onInput: (e: React.FormEvent<HTMLElement>) => {
        const element = e.target as HTMLElement;
        setText(element.textContent || "");
      },
    };

    // Props specific to display state
    const displayProps = {
      ...commonProps,
      onDoubleClick: handleDoubleClick,
    };

    // Choose props based on editing state
    const props = isEditing ? editingProps : displayProps;

    // Create the appropriate element
    switch (as) {
      case "h1": return createElementWithRef("h1", { ...props, children: text });
      case "h2": return createElementWithRef("h2", { ...props, children: text });
      case "h3": return createElementWithRef("h3", { ...props, children: text });
      case "h4": return createElementWithRef("h4", { ...props, children: text });
      case "h5": return createElementWithRef("h5", { ...props, children: text });
      case "h6": return createElementWithRef("h6", { ...props, children: text });
      case "span": return createElementWithRef("span", { ...props, children: text });
      case "p":
      default: return createElementWithRef("p", { ...props, children: text });
    }
  };

  return renderEditableElement();
};

export default EditableText;
