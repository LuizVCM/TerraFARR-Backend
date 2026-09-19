import z from "zod";
import { AreaUnit } from "../calc/area-converter";
export const createTerritorySchema = z.object({
  cep: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => /^\d{8}$/.test(value), {
      error: "CEP inválido",
    }),
  area: z.coerce
    .number("A área deve ser um número")
    .positive("A área não pode ser um número negativo"),
  unidadeArea: z.enum(AreaUnit, "Unidade de área inválida"),
});
export const updateTerritorySchema = z
  .object({
    cep: z
      .string()
      .transform((value) => value.replace(/\D/g, ""))
      .refine((value) => /^\d{8}$/.test(value), {
        error: "CEP inválido",
      })
      .optional(),
    area: z
      .number("A área deve ser um número")
      .positive("A área não pode ser um número negativo")
      .optional(),
    unidadeArea: z.enum(AreaUnit, "Unidade de área inválida").optional(),
  })
  .refine(
    (data) => (data.area === undefined) === (data.unidadeArea === undefined),
    {
      error: "a área e unidade dela devem ser informadas juntas",
    }
  );
export type CreateTerritoryDTO = z.infer<typeof createTerritorySchema>;
export type UpdateTerritoryDTO = z.infer<typeof updateTerritorySchema>;
