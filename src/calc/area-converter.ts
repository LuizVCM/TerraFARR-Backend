export enum AreaUnit {
  M2 = "m2",
  HA = "ha",
  KM2 = "km2",
}

export function toSquareMeters(value: number, unit: AreaUnit): number {
  switch (unit) {
    case AreaUnit.M2:
      return value;

    case AreaUnit.HA:
      return value * 10_000;

    case AreaUnit.KM2:
      return value * 1_000_000;
  }
}

export function fromSquareMeters(value: number, unit: AreaUnit): number {
  switch (unit) {
    case AreaUnit.M2:
      return value;

    case AreaUnit.HA:
      return value / 10_000;

    case AreaUnit.KM2:
      return value / 1_000_000;
  }
}