import { Entity, Column, OneToMany } from "typeorm";
import { Seed } from "./Seed";
import { BaseModel } from "./BaseModel";

export enum NpkUnit {
  MG_KG = "mg/kg",
  PPM = "ppm",
  PERCENT = "%",
}

export enum PlantCategory {
  CEREAIS = "cereais",
  LEGUMINOSAS = "leguminosas",
  TUBERCULOS = "tubérculos",
  HORTALICAS = "hortaliças",
  FRUTAS = "frutas",
  OLEAGINOSAS = "oleaginosas",
  FIBRAS ="fibras",
  FORRAGEIRAS ="forrageiras",
  ESTIMULANTES = "estimulantes",
  ADOCANTES = "adoçantes",
  INDUSTRIAIS = "industriais",
};

@Entity("plantas")
export class Plant extends BaseModel {
  @Column({ length: 100, nullable: false })
  nome: string;
  @Column({ length: 150, nullable: false, unique: true })
  nomeCientifico: string;
  @Column({ type: "enum", enum: PlantCategory, nullable: true })
  categoria: PlantCategory | null;
  @Column({ type: "int", nullable: false })
  cicloMinimoDias: number;
  @Column({ type: "int", nullable: false })
  cicloMaximoDias: number;
  @Column({ type: "decimal", precision: 4, scale: 2, nullable: true })
  phMinimo: number | null;
  @Column({ type: "decimal", precision: 4, scale: 2, nullable: true })
  phMaximo: number | null;
  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  // em celsius
  temperaturaMinima: number | null;
  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  // em celsius
  temperaturaMaxima: number | null;
  @Column({ type: "decimal", precision: 6, scale: 2, nullable: true })
  // precipitação anual em milímetros (mm)
  precipitacaoMinima: number | null;
  @Column({ type: "decimal", precision: 6, scale: 2, nullable: true })
  // precipitação anual em milímetros (mm)
  precipitacaoMaxima: number | null;
  @Column({ type: "varchar", length: 50, nullable: true })
  necessidadeLuz: string | null;
  @Column({ type: "varchar", length: 50, nullable: true })
  necessidadeAgua: string | null;
  @Column({ type: "varchar", length: 100, nullable: true })
  texturaSolo: string | null;
  /** coeficiente médio de cultura  */
  @Column({ type: "decimal", precision: 6, scale: 4, nullable: true })
  kcMedio: number | null;
  @Column({ type: "decimal", precision: 8, scale: 2, nullable: true })
  nitrogenio: number | null;
  @Column({ type: "decimal", precision: 8, scale: 2, nullable: true })
  fosforo: number | null;
  @Column({ type: "decimal", precision: 8, scale: 2, nullable: true })
  potassio: number | null;
  @Column({ type: "enum", enum: NpkUnit, nullable: true })
  unidadeNpk: NpkUnit | null;
  @OneToMany(() => Seed, (sementes) => sementes.planta)
  sementes: Seed[];
  /** retorna o ciclo médio em dias, arredondado. se algum dos valores for nulo, retorna null
   */
  getCicloMedioDias(): number | null {
    if (this.cicloMinimoDias == null || this.cicloMaximoDias == null) {
      return null;
    }
    return Math.round((this.cicloMinimoDias + this.cicloMaximoDias) / 2);
  }
}