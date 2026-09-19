import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./User";
import { BaseModel } from "./BaseModel";

export enum FinanceType {
  DESPESA = "despesa",
  GANHO = "ganho",
}

@Entity("financas")
export class Finance extends BaseModel {
  @Column({ type: "enum", enum: FinanceType, nullable: false })
  tipo: FinanceType;
  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: false,
  })
  valor: number;
  @Column({ type: "text", nullable: true })
  observacoes: string | null;
  @Column({ type: "text", nullable: true })
  detalhes: string | null;
  @Column({ type: "date", nullable: false })
  data: string;
  @ManyToOne(() => User, (usuario) => usuario.financas)
  usuario: User;
}