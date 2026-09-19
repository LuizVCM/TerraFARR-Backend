import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { User } from "./User";
import { BaseModel } from "./BaseModel";
import { Plant } from "./Plant";
import { Crop } from "./Crop";

export enum WeightUnit {
  KG = "kg",
  SACAS = "sacas",
  TON = "ton",
  LITROS = "litros",
}

@Entity("sementes")
export class Seed extends BaseModel {
  @Column({ type: "date", nullable: false })
  dataCompra: Date;
  @Column({ type: "date", nullable: true })
  dataValidade: Date | null;
  @Column({ type: "int", nullable: false })
  quantidade: number;
  @Column({ type: "enum", enum: WeightUnit, nullable: false })
  unidadePeso: WeightUnit;
  @Column({ type: "varchar", length: 100, nullable: true })
  fornecedor: string | null;
  @Column({ type: "text", nullable: true })
  observacoes: string | null;
  @OneToOne(() => Crop, (plantacao) => plantacao.sementes)
  plantacao: Crop;
  @ManyToOne(() => User, (usuario) => usuario.sementes)
  usuario: User;
  @ManyToOne(() => Plant, (planta) => planta.sementes)
  planta: Plant;
}