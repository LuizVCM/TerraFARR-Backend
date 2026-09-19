import { Weather } from "../models/Weather";
import { TerritoryMapper } from "./TerritoryMapper";

export class WeatherMapper {
  static toResponse(weather: Weather) {
    return {
      id: weather.id,
      data: weather.data,
      temperaturaMinima: weather.temperaturaMinima,
      temperaturaMaxima: weather.temperaturaMaxima,
      precipitacao: weather.precipitacao,
      velocidadeVentoMaxima: weather.velocidadeVentoMaxima,
      evapotranspiracao:
        weather.evapotranspiracao ?? "evapotranspiração indisponível",
      territorio: weather.territorio
        ? TerritoryMapper.toSummaryResponse(weather.territorio)
        : "território indisponível",
    };
  }
  static toSummaryResponse(weather: Weather) {
    return {
      id: weather.id,
      data: weather.data,
      temperaturaMinima: weather.temperaturaMinima,
      temperaturaMaxima: weather.temperaturaMaxima,
      precipitacao: weather.precipitacao,
      velocidadeVentoMaxima: weather.velocidadeVentoMaxima,
      evapotranspiracao:
        weather.evapotranspiracao ?? "evapotranspiração indisponível",
    };
  }
  static toResponseList(weatherList: Weather[]) {
    return weatherList.map((weather) => WeatherMapper.toResponse(weather));
  }
  static toSummaryResponseList(weatherList: Weather[]) {
    return weatherList.map((weather) =>
      WeatherMapper.toSummaryResponse(weather)
    );
  }
}