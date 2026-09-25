import z from "zod";
import { CropStatus } from "../models/Crop";
import { AreaUnit } from "../calc/area-converter";

export const createCropSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(100, "Nome é muito longo"),
  sementeId: z.coerce.number("ID inválido").positive("ID inválido"),
  variedade: z
    .string()
    .max(100, "Variedade é muito longa")
    .nullable()
    .optional(),
  area: z.coerce
    .number("A área deve ser um número")
    .positive("A área não pode ser um número negativo"),
  unidadeArea: z.enum(AreaUnit, "Unidade de área inválida"),
  dataPlantio: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  responsavel: z
    .string()
    .max(100, "Nome do responsável é muito longo")
    .nullable()
    .optional(),
  status: z
    .enum(CropStatus, "Tipo de status inválido")
    .default(CropStatus.PLANEJADA),
  observacoes: z.string().nullable().optional(),
});
export const updateCropSchema = z
  .object({
    nome: z
      .string()
      .min(3, "Nome é muito curto")
      .max(100, "Nome é muito longo")
      .optional(),
    sementeId: z.coerce
      .number("ID inválido")
      .positive("ID inválido")
      .nullable()
      .optional(),
    variedade: z
      .string()
      .max(100, "Variedade é muita longa")
      .nullable()
      .optional(),
    area: z.coerce
      .number("A área deve ser um número")
      .positive("A área não pode ser um número negativo")
      .optional(),
    unidadeArea: z.enum(AreaUnit, "Unidade de área inválida").optional(),
    dataPlantio: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD")
      .nullable()
      .optional(),
    dataColheitaReal: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD")
      .nullable()
      .optional(),
    responsavel: z
      .string()
      .max(100, "Nome é muito longo")
      .nullable()
      .optional(),
    status: z.enum(CropStatus, "Tipo de status inválido").optional(),
    observacoes: z
      .string()
      .max(255, "Observações muito longas")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => (data.area === undefined) === (data.unidadeArea === undefined),
    {
      error: "a área e unidade dela devem ser informadas juntas",
    }
  );
export type CreateCropDTO = z.infer<typeof createCropSchema>;
export type UpdateCropDTO = z.infer<typeof updateCropSchema>;