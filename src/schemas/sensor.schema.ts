import z from "zod";
import { SensorType } from "../models/Sensor";
export const createSensorSchema = z.object({
  modelo: z.string().min(1, "Muito curto").max(255, "Muito longo"),
  tipo: z.enum(SensorType),
});
export const updateSensorSchema = createSensorSchema.partial();
export type CreateSensorDTO = z.infer<typeof createSensorSchema>;
export type UpdateSensorDTO = z.infer<typeof updateSensorSchema>;