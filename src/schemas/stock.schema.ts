import z from "zod";
import { StockCategory, StockUnit } from "../models/Stock";
export const createStockSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "No mínimo 1 caracter")
    .max(100, "No máximo 100 caracteres"),
  categoria: z.enum(StockCategory, "Tipo de categoria inválido"),
  quantidade: z.coerce
    .number("A quantidade deve ser um número")
    .positive("A quantidade deve ser positiva"),
  unidade: z.enum(StockUnit, "Tipo de unidade inválido"),
  dataValidade: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD")
    .nullable()
    .optional(),
});
export const updateStockSchema = createStockSchema.partial();
export type CreateStockDTO = z.infer<typeof createStockSchema>;
export type UpdateStockDTO = z.infer<typeof updateStockSchema>;