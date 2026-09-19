import { WeatherRepository } from "../repositories/WeatherRepository";
import { TerritoryRepository } from "../repositories/TerritoryRepository";
import { NotFoundError } from "../errors/NotFoundError";
import { CreateWeatherDTO } from "../schemas/weather.schema";
import { UserRepository } from "../repositories/UserRepository";
import { WeatherMapper } from "../mappers/WeatherMapper";
import { AuthorizationService } from "./AuthorizationService";
import { ConflictError } from "../errors/ConflictError";

export class WeatherService {
  private repo = new WeatherRepository();
  private userRepo = new UserRepository();
  private territoryRepo = new TerritoryRepository();
  async listAll() {
    const weatherData = await this.repo.findAllWithTerritory();
    return WeatherMapper.toResponseList(weatherData);
  }
  async getById(id: number, loggedUserId: number) {
    const weatherData = await this.repo.findByIdWithTeritory(id);
    if (!weatherData) {
      throw new NotFoundError("registro climático");
    }
    AuthorizationService.ensureRelationActive(
      weatherData.territorio,
      "registro climático",
      "território"
    );
    AuthorizationService.ensureOwnership(
      weatherData.territorio,
      loggedUserId,
      "registro climático"
    );
    return WeatherMapper.toResponse(weatherData);
  }
  async findByTerritoryId(territoryId: number, loggedUserId: number) {
    const territory = await this.territoryRepo.base.findById(territoryId);
    if (!territory) {
      throw new NotFoundError("território");
    }
    AuthorizationService.ensureOwnership(territory, loggedUserId, "território");
    const weatherData = await this.repo.findByTerritoryId(territoryId);
    return WeatherMapper.toResponseList(weatherData);
  }
  async listByUserLogged(userId: number) {
    const user = await this.userRepo.base.findById(userId);
    if (!user) {
      throw new NotFoundError("usuário");
    }
    const weatherData = await this.repo.findAllByUserId(userId);
    return WeatherMapper.toResponseList(weatherData);
  }
  async create(
    data: CreateWeatherDTO,
    territoryId: number,
    loggedUserId: number
  ) {
    const territory = await this.territoryRepo.findByIdWithUser(territoryId);
    if (!territory) {
      throw new NotFoundError("território");
    }
    const conflict = await this.repo.findConflicts(territoryId);
    if (conflict) {
      throw new ConflictError(["data"], "Já poosui registro para o dia atual");
    }
    AuthorizationService.ensureOwnership(territory, loggedUserId, "território");
    const weatherData = {
      data: data.daily.time[0],
      temperaturaMaxima: data.daily.temperature_2m_max[0],
      temperaturaMinima: data.daily.temperature_2m_min[0],
      precipitacao: data.daily.precipitation_sum[0],
      velocidadeVentoMaxima: data.daily.wind_speed_10m_max[0],
      evapotranspiracao: data.daily.et0_fao_evapotranspiration[0],
    };
    const weather = await this.repo.create(weatherData, territory);
    return WeatherMapper.toResponse(weather);
  }
}