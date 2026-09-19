import { DataSensor } from "./../models/DataSensor";

export class DataSensorMapper {
  static toResponse(data: DataSensor) {
    return {
      id: data.id,
      valor: data.valor,
      unidade: data.sensor.getUnidade(),
      dataLeitura: data.dataLeitura,
      sensor: data.sensor,
    };
  }
  static toSummaryResponse(data: DataSensor) {
    return {
      id: data.id,
      valor: data.valor,
      unidade: data.sensor.getUnidade(),
      dataLeitura: data.dataLeitura,
    };
  }
  static toResponseList(dataList: DataSensor[]) {
    return dataList.map((data) => DataSensorMapper.toResponse(data));
  }
  static toSummaryResponseList(dataList: DataSensor[]) {
    return dataList.map((data) => DataSensorMapper.toSummaryResponse(data));
  }
}