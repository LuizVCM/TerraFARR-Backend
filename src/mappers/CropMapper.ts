import { Crop, CropStatus } from "../models/Crop";
import { Plant } from "../models/Plant";
import { CreateCropDTO, UpdateCropDTO } from "../schemas/crop.schema";
import { fromSquareMeters, toSquareMeters } from "../calc/area-converter";
import { setHarvestForecast } from "../utils/date-utils";
import { TerritoryMapper } from "./TerritoryMapper";
import { SeedMapper } from "./SeedMapper";

export class CropMapper {
  static toResponse(crop: Crop) {
    return {
      id: crop.id,
      nome: crop.nome,
      cultura: crop.sementes
        ? SeedMapper.toSummaryResponse(crop.sementes)
        : "indisponível",
      variedade: crop.variedade ? crop.variedade : "variedade não informada",
      area: fromSquareMeters(crop.areaM2, crop.unidadeArea),
      unidadeArea: crop.unidadeArea,
      dataPlantio: crop.dataPlantio ? crop.dataPlantio : "data não informada",
      dataColheitaPrevista: crop.dataColheitaPrevista
        ? crop.dataColheitaPrevista
        : "não foi possível calcular",
      responsavel: crop.responsavel
        ? crop.responsavel
        : "responsável não informado",
      status: crop.status,
      observacoes: crop.observacoes ? crop.observacoes : "sem observações",
      territorio: crop.territorio
        ? TerritoryMapper.toSummaryResponse(crop.territorio)
        : "território indisponível",
    };
  }
  static toSummaryResponse(crop: Crop) {
    return {
      id: crop.id,
      nome: crop.nome,
      cultura: crop.sementes
        ? SeedMapper.toSummaryResponse(crop.sementes)
        : "indisponível",
      variedade: crop.variedade ? crop.variedade : "variedade não informada",
      area: fromSquareMeters(crop.areaM2, crop.unidadeArea),
      unidadeArea: crop.unidadeArea,
      dataPlantio: crop.dataPlantio ? crop.dataPlantio : "data não informada",
      dataColheitaPrevista: crop.dataColheitaPrevista
        ? crop.dataColheitaPrevista
        : "não foi possível calcular",
      responsavel: crop.responsavel
        ? crop.responsavel
        : "responsável não informado",
      status: crop.status,
      observacoes: crop.observacoes ? crop.observacoes : "sem observações",
    };
  }
  static toResponseList(crops: Crop[]) {
    return crops.map((crop) => CropMapper.toResponse(crop));
  }
  static toCreateEntity(data: CreateCropDTO, cultivation: Plant) {
    const dataPlantio = data.dataPlantio ? new Date(data.dataPlantio) : null;
    const cicloMedio = cultivation.getCicloMedioDias();
    const dataColheitaPrevista = setHarvestForecast(dataPlantio, cicloMedio);
    return {
      nome: data.nome,
      variedade: data.variedade ?? null,
      areaM2: toSquareMeters(data.area, data.unidadeArea),
      unidadeArea: data.unidadeArea,
      dataPlantio: data.dataPlantio ? new Date(data.dataPlantio) : null,
      dataColheitaPrevista: dataColheitaPrevista,
      responsavel: data.responsavel ?? null,
      status: data.status ?? CropStatus.PLANEJADA,
      observacoes: data.observacoes ?? null,
    };
  }
  static toUpdateEntity(data: UpdateCropDTO) {
    const result: Partial<Crop> = {};
    if (data.area !== undefined && data.unidadeArea !== undefined) {
      result.areaM2 = toSquareMeters(data.area, data.unidadeArea!);
      result.unidadeArea = data.unidadeArea!;
    }
    return result;
  }
}