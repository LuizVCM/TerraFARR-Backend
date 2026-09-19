import { computeKcMedio } from "../../calc/kc-calculator";
import { Plant } from "../../models/Plant";
import { AppDataSource } from "../data-source";
import { plantsData } from "../data/plant.data";

export async function insertPlants() {
  const repo = AppDataSource.getRepository(Plant);
   const plantsToSave = plantsData.map((plant) => {
      const kcMedio = computeKcMedio({
        kcIni: plant.kcIni,
        kcIniMax: plant.kcIniMax,
        kcMid: plant.kcMid,
        kcMidMax: plant.kcMidMax,
        kcEnd: plant.kcEnd,
        kcEndMax: plant.kcEndMax,
        iniDays: plant.iniDays,
        devDays: plant.devDays,
        midDays: plant.midDays,
        lateDays: plant.lateDays,
      });
      // remove os campos que não são salvos
      const { kcIni, kcIniMax, kcMid, kcMidMax, kcEnd, kcEndMax, iniDays, devDays, midDays, lateDays, ...rest } = plant;
      return { ...rest, kcMedio };
    });
  for (const data of plantsToSave) {
    const exists = await repo.findOne({
      where: {
        nomeCientifico: data.nomeCientifico,
      },
    });
    if (exists) {
      repo.merge(exists, data);
      await repo.save(exists);
      continue;
    }
    const plant = repo.create(data);
    await repo.save(plant);
  }
}