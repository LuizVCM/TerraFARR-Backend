import z from "zod";
export const createDataSensorSchema = z.object({
  valor: z.number(),
});
export type CreateDataSensorDTO = z.infer<typeof createDataSensorSchema>;