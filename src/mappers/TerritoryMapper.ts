import {
  CreateTerritoryDTO,
  UpdateTerritoryDTO,
} from "./../schemas/territory.schema";
import { Territory } from "../models/Territory";
import { fromSquareMeters, toSquareMeters } from "../calc/area-converter";
import { UserMapper } from "./UserMapper";
import { CropMapper } from "./CropMapper";

export class TerritoryMapper {
  static toResponse(territory: Territory) {
    return {
      id: territory.id,
      cep: territory.cep,
      cidade: territory.cidade,
      estado: territory.estado,
      bairro: territory.bairro ?? "indisponível",
      logradouro: territory.logradouro ?? "indisponível",
      area: fromSquareMeters(Number(territory.areaM2), territory.unidadeArea),
      unidadeArea: territory.unidadeArea,
      usuario: territory.usuario
        ? UserMapper.toSummaryResponse(territory.usuario)
        : "usuário indisponível",
      plantacoes: territory.plantacoes
        ? territory.plantacoes.map(CropMapper.toSummaryResponse)
        : "plantações indisponíveis",
    };
  }
  static toSummaryResponse(territory: Territory) {
    return {
      id: territory.id,
      cep: territory.cep,
      cidade: territory.cidade,
      estado: territory.estado,
      bairro: territory.bairro ?? "indisponível",
      logradouro: territory.logradouro ?? "indisponível",
      area: fromSquareMeters(Number(territory.areaM2), territory.unidadeArea),
      unidadeArea: territory.unidadeArea,
    };
  }
  static toResponseList(territories: Territory[]) {
    return territories.map((territory) =>
      TerritoryMapper.toResponse(territory)
    );
  }
  static toSummaryResponseList(territories: Territory[]) {
    return territories.map((territory) =>
      TerritoryMapper.toSummaryResponse(territory)
    );
  }
  static toCreateEntity(data: CreateTerritoryDTO) {
    return {
      cep: data.cep,
      unidadeArea: data.unidadeArea,
      areaM2: toSquareMeters(data.area, data.unidadeArea),
    };
  }
  static toUpdateEntity(data: UpdateTerritoryDTO) {
    const result: Partial<Territory> = {};
    if (data.area !== undefined && data.unidadeArea !== undefined) {
      result.areaM2 = toSquareMeters(data.area, data.unidadeArea!);
      result.unidadeArea = data.unidadeArea!;
    }
    return result;
  }
}