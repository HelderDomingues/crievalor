
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
              onChange={onChange ? (e) => onChange(e, field.onChange) : field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
