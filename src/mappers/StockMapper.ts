import { Stock } from "../models/Stock";
import { UserMapper } from "./UserMapper";

export class StockMapper {
  static toResponse(stock: Stock) {
    return {
      id: stock.id,
      nome: stock.nome,
      quantidade: stock.quantidade,
      unidade: stock.unidade,
      dataValidade: stock.dataValidade,
      usuario: stock.usuario
        ? UserMapper.toSummaryResponse(stock.usuario)
        : "usuário indisponível",
    };
  }
  static toSummaryResponse(stock: Stock) {
    return {
      id: stock.id,
      nome: stock.nome,
      quantidade: stock.quantidade,
      unidade: stock.unidade,
      dataValidade: stock.dataValidade,
    };
  }
  static toResponseList(stocks: Stock[]) {
    return stocks.map((stock) => StockMapper.toResponse(stock));
  }
  static toSummaryResponseList(stocks: Stock[]) {
    return stocks.map((stock) => StockMapper.toSummaryResponse(stock));
  }
}