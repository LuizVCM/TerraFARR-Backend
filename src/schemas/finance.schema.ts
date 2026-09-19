import z from "zod";
import { FinanceType } from "../models/Finance";
export const createFinanceSchema = z.object({
  tipo: z.enum(FinanceType, "Tipo de finança inválido"),
  valor: z.coerce
    .number("O valor deve ser um número")
    .positive("O valor deve ser positivo").max(999999.99, "Apenas valores abaixo de 1 milhão"),
  observacoes: z
    .string()
    .trim()
    .min(1, "No mínimo 1 caracter")
    .max(255, "No máximo 255 caracteres")
    .nullable()
    .optional(),
  detalhes: z
    .string()
    .trim()
    .min(1, "No mínimo 1 caracter")
    .max(255, "No máximo 255 caracteres")
    .nullable()
    .optional(),
  data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
});
export const updateFinanceSchema = createFinanceSchema.partial();
export type CreateFinanceDTO = z.infer<typeof createFinanceSchema>;
export type UpdateFinanceDTO = z.infer<typeof updateFinanceSchema>;