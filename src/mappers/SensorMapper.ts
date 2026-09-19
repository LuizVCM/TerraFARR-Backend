import { Sensor } from "./../models/Sensor";
import { DataSensorMapper } from "./DataSensor";
import { TerritoryMapper } from "./TerritoryMapper";

export class SensorMapper {
  static toResponse(sensor: Sensor) {
    return {
      id: sensor.id,
      modelo: sensor.modelo,
      tipo: sensor.tipo,
      unidade: sensor.getUnidade(),
      territorios: sensor.territorio
        ? TerritoryMapper.toSummaryResponse(sensor.territorio)
        : "indisponível",
      dados: sensor.dados
        ? DataSensorMapper.toSummaryResponseList(sensor.dados)
        : "sem dados",
    };
  }
  static toSummaryResponse(sensor: Sensor) {
    return {
      id: sensor.id,
      modelo: sensor.modelo,
      tipo: sensor.tipo,
      unidade: sensor.getUnidade(),
    };
  }
  static toResponseList(sensorList: Sensor[]) {
    return sensorList.map((sensor) => SensorMapper.toResponse(sensor));
  }
  static toSummaryResponseList(sensorList: Sensor[]) {
    return sensorList.map((sensor) => SensorMapper.toSummaryResponse(sensor));
  }
}