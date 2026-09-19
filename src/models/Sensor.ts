import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { DataSensor } from "./DataSensor";
import { Territory } from "./Territory";
import { BaseModel } from "./BaseModel";

export enum SensorType {
  UMIDADE_AR = "umidade do ar",
  TEMPERATURA_AR = "temperatura do ar",
  UMIDADE_SOLO = "umidade do solo",
  TEMPERATURA_SOLO = "temperatura do solo",
  PRESSAO = "pressão",
}

@Entity("sensores")
export class Sensor extends BaseModel {
  @Column({ type: "varchar", nullable: false })
  modelo: string;
  @Column({
    type: "enum",
    enum: SensorType,
    nullable: false,
  })
  tipo: SensorType;
  @ManyToOne(() => Territory, (territorio) => territorio.sensores)
  territorio: Territory;
  @OneToMany(() => DataSensor, (data) => data.sensor)
  dados: DataSensor[];

  getUnidade(): string {
    switch (this.tipo) {
      case SensorType.UMIDADE_AR:
        return "%";
      case SensorType.TEMPERATURA_AR:
        return "°C";
      case SensorType.UMIDADE_SOLO:
        return "%";
      case SensorType.TEMPERATURA_SOLO:
        return "°C";
      case SensorType.PRESSAO:
        return "hPa"; // ver qual unidade vai ser, outras comuns: "mmHg" e "atm"
    }
  }
}