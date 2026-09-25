export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
export function setHarvestForecast(
  dataPlantio: Date | null | undefined,
  cicloMedioDias: number | null | undefined
): Date | null {
  if (!dataPlantio || cicloMedioDias == null || cicloMedioDias <= 0) {
    return null;
  }
  return addDays(dataPlantio, cicloMedioDias);
}
export function formateDateToString(date: Date | null): string | null {
  if (date) {
    const dateToLocaleString = date.toLocaleDateString();
    const [day, month, year] = dateToLocaleString.substring(0, 10).split("/");
    return `${year}-${month}-${day}`;
  } else {
    return null;
  }
}