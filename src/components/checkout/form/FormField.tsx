
import React from "react";
import { 
  FormControl, 
  FormField as BaseFormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { formatPhoneNumber, formatCPF } from "@/utils/formatters";

interface FormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  type = "text",
  onChange
}) => {
  // Default onChange handlers for common field types
  const handleDefaultChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    if (name === "phone") {
      onChange(formatPhoneNumber(e.target.value));
    } else if (name === "cpf") {
      onChange(formatCPF(e.target.value));
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <BaseFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              type={type} 
              placeholder={placeholder} 
              {...field} 
              onChange={onChange 
                ? (e) => onChange(e, field.onChange) 
                : (e) => handleDefaultChange(e, field.onChange)
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
