import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Weather } from "./Weather";
import { Sensor } from "./Sensor";
import { BaseModel } from "./BaseModel";
import { AreaUnit } from "../calc/area-converter";
import { Crop } from "./Crop";

@Entity("territorios")
export class Territory extends BaseModel {
  @Column({ type: "char", length: 8 })
  cep: string;
  @Column({
    length: 100,
  })
  cidade: string;
  @Column({
    length: 100,
  })
  estado: string;
  @Column({
    type: "varchar",
    length: 150,
    nullable: true,
  })
  bairro: string | null;
  @Column({
    type: "varchar",
    length: 150,
    nullable: true,
  })
  logradouro: string | null;
  @Column("decimal", {
    precision: 12,
    scale: 2,
  })
  areaM2: number;
  @Column({
    type: "enum",
    enum: AreaUnit,
  })
  unidadeArea: AreaUnit;
  @OneToMany(() => Crop, (plantacao) => plantacao.territorio)
  plantacoes: Crop[];
  @ManyToOne(() => User, (usuario) => usuario.territorios)
  usuario: User;
  @OneToMany(() => Weather, (clima) => clima.territorio)
  clima: Weather[];
  @OneToMany(() => Sensor, (sensor) => sensor.territorio)
  sensores: Sensor[];
}
