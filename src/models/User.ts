import { Column, Entity, OneToMany } from "typeorm";
import { Seed } from "./Seed";
import { Territory } from "./Territory";
import { Finance } from "./Finance";
import { Stock } from "./Stock";
import { BaseModel } from "./BaseModel";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Entity("usuarios")
export class User extends BaseModel {
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
  @Column({ type: "varchar", length: 100, nullable: false })
  nome: string;
  @Column({ type: "varchar", length: 100, nullable: true })
  sobrenome: string | null;
  @Column({ length: 100, nullable: false, unique: true })
  email: string;
  @Column({ length: 20, type: "varchar", nullable: true, unique: true })
  telefone: string | null;
  @Column({ length: 11, type: "char", nullable: true, unique: true })
  cpf: string | null;
  @Column({ select: false })
  senha: string;
  @OneToMany(() => Seed, (semente) => semente.usuario)
  sementes: Seed[];
  @OneToMany(() => Territory, (territorio) => territorio.usuario)
  territorios: Territory[];
  @OneToMany(() => Finance, (financas) => financas.usuario)
  financas: Finance[];
  @OneToMany(() => Stock, (insumos) => insumos.usuario)
  insumos: Stock[];
}