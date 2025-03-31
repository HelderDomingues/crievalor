
import * as z from "zod";
import { isValidPhoneNumber } from "@/utils/formatters";

export const registrationFormSchema = z.object({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string()
    .refine(val => isValidPhoneNumber(val), {
      message: "Telefone deve ter 10 ou 11 dígitos incluindo DDD",
    }),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type RegistrationFormData = z.infer<typeof registrationFormSchema>;
