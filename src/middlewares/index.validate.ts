import { createCropSchema, updateCropSchema } from "../schemas/crop.schema";
import { createDataSensorSchema } from "../schemas/data-sensor.schema";
import {
  createFinanceSchema,
  updateFinanceSchema,
} from "../schemas/finance.schema";
import { createSeedSchema, updateSeedSchema } from "../schemas/seed.schema";
import {
  createSensorSchema,
  updateSensorSchema,
} from "../schemas/sensor.schema";
import { createStockSchema, updateStockSchema } from "../schemas/stock.schema";
import {
  createTerritorySchema,
  updateTerritorySchema,
} from "../schemas/territory.schema";
import {
  createAdminSchema,
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../schemas/user.schema";
import { createWeatherSchema } from "../schemas/weather.schema";
import { validate } from "./validate";
export const validateAdminCreate = validate(createAdminSchema);
export const validateUserCreate = validate(createUserSchema);
export const validateUserUpdate = validate(updateUserSchema);
export const validateUserLogin = validate(loginUserSchema);
export const validateTerritoryCreate = validate(createTerritorySchema);
export const validateTerritoryUpdate = validate(updateTerritorySchema);
export const validateCropCreate = validate(createCropSchema);
export const validateCropUpdate = validate(updateCropSchema);
export const validateFinanceCreate = validate(createFinanceSchema);
export const validateFinanceUpdate = validate(updateFinanceSchema);
export const validateStockCreate = validate(createStockSchema);
export const validateStockUpdate = validate(updateStockSchema);
export const validateSeedCreate = validate(createSeedSchema);
export const validateSeedUpdate = validate(updateSeedSchema);
export const validateWeatherCreate = validate(createWeatherSchema);
export const validateSensorCreate = validate(createSensorSchema);
export const validateSensorUpdate = validate(updateSensorSchema);
export const validateDataSensorCreate = validate(createDataSensorSchema);