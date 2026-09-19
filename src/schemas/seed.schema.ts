import z from "zod";
import { WeightUnit } from "../models/Seed";

const seedFields = {
  plantaId: z.coerce.number("ID inválido").positive("ID inválido"),

  dataCompra: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),

  dataValidade: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),

  quantidade: z.coerce
    .number("Quantidade deve ser um número")
    .positive("Quantidade deve ser maior que zero"),

  unidadePeso: z.enum(WeightUnit, "Tipo de unidade de peso inválido"),

  fornecedor: z
    .string()
    .trim()
    .max(100, "Nome do fornecedor é muito longo")
    .optional()
    .nullable(),

  observacoes: z
    .string()
    .trim()
    .max(255, "Observações muito longas")
    .optional()
    .nullable(),
};

export const createSeedSchema = z
  .object(seedFields)
  .refine((data) => data.dataValidade > data.dataCompra, {
    message: "A data de validade deve ser posterior à data de compra",
    path: ["dataValidade"],
  });

export const updateSeedSchema = z.object(seedFields).partial();

export type CreateSeedDTO = z.infer<typeof createSeedSchema>;
export type UpdateSeedDTO = z.infer<typeof updateSeedSchema>;