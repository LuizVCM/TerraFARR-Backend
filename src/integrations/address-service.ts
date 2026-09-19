import { BadRequestError } from "../errors/BadRequestError";
import { InternalServerError } from "../errors/InternalServerError";

export interface AddressData {
  cep: string;
  cidade: string;
  estado: string;
  bairro: string | null;
  logradouro: string | null;
  erro?: boolean;
}
export async function fetchAddress(cep: string): Promise<AddressData> {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
  if (!response.ok) {
    throw new InternalServerError("Não foi possível validar o CEP");
  }
  const data = await response.json();

  if (data.erro) {
    throw new BadRequestError({
      message: "CEP não encontrado",
    });
  }

  return {
    cep: cep, // a api envia não normalizado (com hífen)
    cidade: data.localidade,
    estado: data.estado,
    bairro: data.bairro,
    logradouro: data.logradouro,
  };
}