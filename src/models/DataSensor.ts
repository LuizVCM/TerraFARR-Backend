import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Sensor } from "./Sensor";

@Entity("dados_sensor")
export class DataSensor {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "decimal", scale: 2, precision: 5, nullable: false })
  valor: number;
  // a unidade é definida pelo tipo de sensor
  @CreateDateColumn()
  dataLeitura: Date;
  @ManyToOne(() => Sensor, (sensor) => sensor.dados)
  sensor: Sensor;
}