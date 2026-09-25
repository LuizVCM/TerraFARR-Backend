import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./User";
import { BaseModel } from "./BaseModel";

export enum StockUnit {
  // massa
  G = "g",
  KG = "kg",
  TON = "ton",
  // volume
  ML = "ml",
  L = "l",
  // contagem/comercial
  SACAS = "sacas",
  UNIDADE = "un",
}

export enum StockCategory {
  FERTILIZANTES = "fertilizantes",
  DEFENSIVOS = "defensivos",
  FERRAMENTAS = "ferramentas",
}

@Entity("estoque_insumos")
export class Stock extends BaseModel {
  @Column({ length: 100 })
  nome: string;
  @Column({ type: "enum", enum: StockCategory, nullable: false })
  categoria: StockCategory;
  @Column({ type: "decimal", scale: 2, precision: 5, nullable: false })
  quantidade: number;
  @Column({ type: "enum", enum: StockUnit, nullable: false })
  unidade: StockUnit;
  @Column({ type: "date", nullable: true })
  dataValidade: string | null;
  @Column({ type: "decimal", scale: 2, precision: 5, nullable: true })
  limiteMinimo: number | null;
  @ManyToOne(() => User, (usuario) => usuario.insumos)
  usuario: User;
}