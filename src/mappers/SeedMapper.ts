import { Seed } from "../models/Seed";
import { CropMapper } from "./CropMapper";
import { PlantMapper } from "./PlantMapper";
import { UserMapper } from "./UserMapper";

export class SeedMapper {
  static toResponse(seed: Seed) {
    return {
      id: seed.id,
      planta: PlantMapper.toResponse(seed.planta),
      quantidade: seed.quantidade,
      unidadePeso: seed.unidadePeso,
      dataCompra: seed.dataCompra,
      dataValidade: seed.dataValidade
        ? seed.dataValidade
        : "data não informada",
      fornecedor: seed.fornecedor ? seed.fornecedor : "não informado",
      observacoes: seed.observacoes ? seed.observacoes : "sem observações",
      plantacao: seed.plantacao
        ? CropMapper.toSummaryResponse(seed.plantacao)
        : "plantação indisponível",
      usuario: seed.usuario
        ? UserMapper.toSummaryResponse(seed.usuario)
        : "usuário indisponível",
    };
  }
  static toSummaryResponse(seed: Seed) {
    return {
      id: seed.id,
      planta: PlantMapper.toResponse(seed.planta),
      quantidade: seed.quantidade,
      unidadePeso: seed.unidadePeso,
      dataCompra: seed.dataCompra,
      dataValidade: seed.dataValidade
        ? seed.dataValidade
        : "data não informada",
      fornecedor: seed.fornecedor ? seed.fornecedor : "não informado",
      observacoes: seed.observacoes ? seed.observacoes : "sem observações",
    };
  }
  static toResponseList(seeds: Seed[]) {
    return seeds.map((seed) => SeedMapper.toResponse(seed));
  }
  static toSummaryResponseList(seeds: Seed[]) {
    return seeds.map((seed) => SeedMapper.toSummaryResponse(seed));
  }
}