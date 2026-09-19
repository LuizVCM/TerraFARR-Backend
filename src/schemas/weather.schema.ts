import z from "zod";
export const createWeatherSchema = z.object({
  daily: z.object({
    time: z.array(z.string()).min(1),
    temperature_2m_max: z.array(z.number()).min(1),
    temperature_2m_min: z.array(z.number()).min(1),
    precipitation_sum: z.array(z.number()).min(1),
    wind_speed_10m_max: z.array(z.number()).min(1),
    et0_fao_evapotranspiration: z.array(z.number()).min(1),
  }),
});
export type CreateWeatherDTO = z.infer<typeof createWeatherSchema>;