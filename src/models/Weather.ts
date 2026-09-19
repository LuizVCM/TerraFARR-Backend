import {
  Column,
  Entity,
  Index,
  ManyToOne,
} from "typeorm";
import { Territory } from "./Territory";
import { BaseModel } from "./BaseModel";


@Index(["territorio", "data"], { unique: true })
@Entity("dados_clima")
export class Weather extends BaseModel {
  @Column({ type: "date" })
  data: string;
  @Column({ type: "decimal", precision: 5, scale: 2 })
  temperaturaMinima: number;
  @Column({ type: "decimal", precision: 5, scale: 2 })
  temperaturaMaxima: number;
  @Column({ type: "decimal", precision: 5, scale: 2 })
  precipitacao: number;
  @Column({ type: "decimal", precision: 5, scale: 2 })
  velocidadeVentoMaxima: number;
  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  evapotranspiracao: number;
  @ManyToOne(() => Territory, territorio => territorio.clima)
  territorio: Territory;
}