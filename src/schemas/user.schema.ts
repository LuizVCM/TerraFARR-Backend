import z from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { cpf } from "cpf-cnpj-validator";
import { UserRole } from "../models/User";

const telefoneSchema = z.string().transform((valor, ctx) => {
  const tiposAceitos = ["MOBILE", "FIXED_LINE", "FIXED_LINE_OR_MOBILE"];
  const telefone = parsePhoneNumberFromString(valor, "BR");
  console.log(telefone?.getType());
  if (
    !telefone?.isValid() ||
    !tiposAceitos.includes(telefone.getType() ?? "")
  ) {
    ctx.addIssue({
      code: "custom",
      message: "Telefone inválido",
    });
    return z.NEVER;
  }
  return telefone.number; // retorna em e164 (ex: +5551999999999)
});

const cpfSchema = z.string().transform((valor, ctx) => {
  const cpfLimpo = cpf.strip(valor);
  if (!cpf.isValid(cpfLimpo)) {
    ctx.addIssue({
      code: "custom",
      message: "CPF inválido",
    });
    return z.NEVER;
  }
  return cpfLimpo;
});

export const passwordSchema = z
  .string("A senha é obrigatória")
  .min(6, "A senha deve ter pelo menos 6 caracteres")
  .regex(/[A-Z]/, "A senha deve ter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "A senha deve ter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "A senha deve ter pelo menos um dígito")
  .regex(/[^a-zA-Z0-9\s]/, "A senha deve ter pelo menos um caractere especial")
  .max(255);

export const createUserSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome é muito curto")
    .max(100, "O nome é muito longo")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/, "Informe nome usando apenas letras"),
  sobrenome: z
    .string()
    .trim()
    .min(3, "O sobrenome é muito curto")
    .max(100, "O sobrenome é muito longo")
    .regex(  /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/, "Informe sobrenome usando apenas letras"),
  email: z.email("E-mail inválido"),
  telefone: telefoneSchema,
  cpf: cpfSchema,
  senha: passwordSchema,
});
export const updateUserSchema = createUserSchema.partial();
export const loginUserSchema = z.object({
  email: z.email("E-mail inválido"),
  senha: z.string().min(1, "A senha é obrigatória"),
});
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>;
export const createAdminSchema = z.object({
  nome: z.string().min(1, "Nome necessário"),
  email: z.email("E-mail obrigatório"),
  senha: passwordSchema,
  role: z.enum(UserRole).optional(),
});
export type CreateAdminDTO = z.infer<typeof createAdminSchema>;
