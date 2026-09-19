export interface CropCoefficients {
  kcIni: number;
  kcIniMax?: number;

  kcMid: number;
  kcMidMax?: number;

  kcEnd: number;
  kcEndMax?: number;

  iniDays: number;
  devDays: number;
  midDays: number;
  lateDays: number;
}

/** extrai a média de um intervalo de coeficientes */
export function getKcRangeAverage(value: number, max?: number): number {
  if (max !== undefined) {
    return (value + max) / 2;
  }
  return value;
}

/** calcula a média ponderada dos coeficientes. os pesos são baseados nos valores de dias de cada fase da planta
 *  @param days os coeficientes de kcIni e kcMid variam na fase de desenvolvimento (consultar figura 34 da fonte de dados). o mesmo acontece na fase final, o coeficiente começa decair do kcMid ao kcEnd. média simples para assumir um valor de coeficiente entre essas fases */
export function calculateKcAverage(
  kcIni: number,
  kcMid: number,
  kcEnd: number,
  iniDays: number,
  devDays: number,
  midDays: number,
  lateDays: number
): number {

  const kcDesenvolvimento = (kcIni + kcMid) / 2;
  const kcFinal = (kcMid + kcEnd) / 2;

  const totalDias = iniDays + devDays + midDays + lateDays;

  return (
    (kcIni * iniDays +
      kcDesenvolvimento * devDays +
      kcMid * midDays +
      kcFinal * lateDays) /
    totalDias
  );
}

/** função que recebe os dados brutos e devolve o kcMedio pronto */
export function computeKcMedio(input: CropCoefficients): number {
  const effectiveIni = getKcRangeAverage(input.kcIni, input.kcIniMax);

  const effectiveMid = getKcRangeAverage(input.kcMid, input.kcMidMax);

  const effectiveEnd = getKcRangeAverage(input.kcEnd, input.kcEndMax);

  return calculateKcAverage(
    effectiveIni,
    effectiveMid,
    effectiveEnd,
    input.iniDays,
    input.devDays,
    input.midDays,
    input.lateDays
  );
}