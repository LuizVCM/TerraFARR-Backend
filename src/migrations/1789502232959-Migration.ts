import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1789502232959 implements MigrationInterface {
    name = 'Migration1789502232959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`plantas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`nome\` varchar(100) NOT NULL, \`nomeCientifico\` varchar(150) NOT NULL, \`categoria\` enum ('cereais', 'leguminosas', 'tubérculos', 'hortaliças', 'fibras', 'oleaginosas', 'frutas', 'forrageiras') NULL, \`cicloMinimoDias\` int NOT NULL, \`cicloMaximoDias\` int NOT NULL, \`phMinimo\` decimal(4,2) NULL, \`phMaximo\` decimal(4,2) NULL, \`temperaturaMinima\` decimal(5,2) NULL, \`temperaturaMaxima\` decimal(5,2) NULL, \`precipitacaoMinima\` decimal(6,2) NULL, \`precipitacaoMaxima\` decimal(6,2) NULL, \`necessidadeLuz\` varchar(50) NULL, \`necessidadeAgua\` varchar(50) NULL, \`texturaSolo\` varchar(100) NULL, \`kcMedio\` decimal(6,4) NULL, \`nitrogenio\` decimal(8,2) NULL, \`fosforo\` decimal(8,2) NULL, \`potassio\` decimal(8,2) NULL, \`unidadeNpk\` enum ('mg/kg', 'ppm', '%') NULL, UNIQUE INDEX \`IDX_d649e3616e52585a18bd710263\` (\`nomeCientifico\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`plantacoes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`nome\` varchar(100) NOT NULL, \`variedade\` varchar(100) NULL, \`areaM2\` decimal(12,2) NOT NULL, \`unidadeArea\` enum ('m2', 'ha', 'km2') NOT NULL, \`dataPlantio\` date NULL, \`dataColheitaReal\` date NULL, \`dataColheitaPrevista\` date NULL, \`responsavel\` varchar(100) NULL, \`status\` enum ('planejada', 'em_andamento', 'concluida', 'cancelada') NOT NULL DEFAULT 'planejada', \`observacoes\` text NULL, \`territorioId\` int NULL, \`sementesId\` int NULL, INDEX \`IDX_4eae007a2eca549e33ea8f9a54\` (\`dataPlantio\`), INDEX \`IDX_4c9028317dfc80980295e9c684\` (\`status\`), INDEX \`IDX_f9d433f426527a5155849342fa\` (\`status\`, \`dataPlantio\`), UNIQUE INDEX \`REL_104f412e768d4a02a954f86129\` (\`sementesId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sementes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`dataCompra\` date NOT NULL, \`dataValidade\` date NULL, \`quantidade\` int NOT NULL, \`unidadePeso\` enum ('kg', 'sacas', 'ton', 'litros') NOT NULL, \`fornecedor\` varchar(100) NULL, \`observacoes\` text NULL, \`usuarioId\` int NULL, \`plantaId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`financas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`tipo\` enum ('despesa', 'ganho') NOT NULL, \`valor\` decimal(10,2) NOT NULL, \`observacoes\` text NULL, \`detalhes\` text NULL, \`data\` date NOT NULL, \`usuarioId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`estoque_insumos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`nome\` varchar(100) NOT NULL, \`quantidade\` decimal(5,2) NOT NULL, \`unidade\` enum ('g', 'kg', 'ton', 'ml', 'l', 'sacas', 'un') NOT NULL, \`dataValidade\` date NULL, \`usuarioId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuarios\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', \`nome\` varchar(100) NOT NULL, \`sobrenome\` varchar(100) NULL, \`email\` varchar(100) NOT NULL, \`telefone\` varchar(20) NULL, \`cpf\` char(11) NULL, \`senha\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_446adfc18b35418aac32ae0b7b\` (\`email\`), UNIQUE INDEX \`IDX_a74e0e525737469ee0a512505f\` (\`telefone\`), UNIQUE INDEX \`IDX_ebebcaef8457dcff6e6d69f17b\` (\`cpf\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`dados_sensor\` (\`id\` int NOT NULL AUTO_INCREMENT, \`valor\` decimal(5,2) NOT NULL, \`dataLeitura\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`sensorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sensores\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`modelo\` varchar(255) NOT NULL, \`tipo\` enum ('umidade do ar', 'temperatura do ar', 'pressão') NOT NULL, \`territorioId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`territorios\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`cep\` char(8) NOT NULL, \`cidade\` varchar(100) NOT NULL, \`estado\` varchar(100) NOT NULL, \`bairro\` varchar(150) NULL, \`logradouro\` varchar(150) NULL, \`areaM2\` decimal(12,2) NOT NULL, \`unidadeArea\` enum ('m2', 'ha', 'km2') NOT NULL, \`usuarioId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`dados_clima\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`data\` date NOT NULL, \`temperaturaMinima\` decimal(5,2) NOT NULL, \`temperaturaMaxima\` decimal(5,2) NOT NULL, \`precipitacao\` decimal(5,2) NOT NULL, \`velocidadeVentoMaxima\` decimal(5,2) NOT NULL, \`evapotranspiracao\` decimal(5,2) NULL, \`territorioId\` int NULL, UNIQUE INDEX \`IDX_266c2c1360e7c758a746dbce14\` (\`territorioId\`, \`data\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`plantacoes\` ADD CONSTRAINT \`FK_848235217695f91ef2a82af7063\` FOREIGN KEY (\`territorioId\`) REFERENCES \`territorios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`plantacoes\` ADD CONSTRAINT \`FK_104f412e768d4a02a954f86129a\` FOREIGN KEY (\`sementesId\`) REFERENCES \`sementes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sementes\` ADD CONSTRAINT \`FK_b9b510c2ca7592e218de7bedd65\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sementes\` ADD CONSTRAINT \`FK_7e3c64102f45f8521d8a1b9f8cf\` FOREIGN KEY (\`plantaId\`) REFERENCES \`plantas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`financas\` ADD CONSTRAINT \`FK_efb3db1b36839d427de7b91dc35\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`estoque_insumos\` ADD CONSTRAINT \`FK_4be93df9bd21db5df649541c669\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dados_sensor\` ADD CONSTRAINT \`FK_823206b89e113840b6f1757ddd4\` FOREIGN KEY (\`sensorId\`) REFERENCES \`sensores\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sensores\` ADD CONSTRAINT \`FK_ef68af9188ad897588eba6c5ab7\` FOREIGN KEY (\`territorioId\`) REFERENCES \`territorios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`territorios\` ADD CONSTRAINT \`FK_767d0781360073b2631ba3e1185\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dados_clima\` ADD CONSTRAINT \`FK_862fae2d0f42a7f7a3f6dc50a80\` FOREIGN KEY (\`territorioId\`) REFERENCES \`territorios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dados_clima\` DROP FOREIGN KEY \`FK_862fae2d0f42a7f7a3f6dc50a80\``);
        await queryRunner.query(`ALTER TABLE \`territorios\` DROP FOREIGN KEY \`FK_767d0781360073b2631ba3e1185\``);
        await queryRunner.query(`ALTER TABLE \`sensores\` DROP FOREIGN KEY \`FK_ef68af9188ad897588eba6c5ab7\``);
        await queryRunner.query(`ALTER TABLE \`dados_sensor\` DROP FOREIGN KEY \`FK_823206b89e113840b6f1757ddd4\``);
        await queryRunner.query(`ALTER TABLE \`estoque_insumos\` DROP FOREIGN KEY \`FK_4be93df9bd21db5df649541c669\``);
        await queryRunner.query(`ALTER TABLE \`financas\` DROP FOREIGN KEY \`FK_efb3db1b36839d427de7b91dc35\``);
        await queryRunner.query(`ALTER TABLE \`sementes\` DROP FOREIGN KEY \`FK_7e3c64102f45f8521d8a1b9f8cf\``);
        await queryRunner.query(`ALTER TABLE \`sementes\` DROP FOREIGN KEY \`FK_b9b510c2ca7592e218de7bedd65\``);
        await queryRunner.query(`ALTER TABLE \`plantacoes\` DROP FOREIGN KEY \`FK_104f412e768d4a02a954f86129a\``);
        await queryRunner.query(`ALTER TABLE \`plantacoes\` DROP FOREIGN KEY \`FK_848235217695f91ef2a82af7063\``);
        await queryRunner.query(`DROP INDEX \`IDX_266c2c1360e7c758a746dbce14\` ON \`dados_clima\``);
        await queryRunner.query(`DROP TABLE \`dados_clima\``);
        await queryRunner.query(`DROP TABLE \`territorios\``);
        await queryRunner.query(`DROP TABLE \`sensores\``);
        await queryRunner.query(`DROP TABLE \`dados_sensor\``);
        await queryRunner.query(`DROP INDEX \`IDX_ebebcaef8457dcff6e6d69f17b\` ON \`usuarios\``);
        await queryRunner.query(`DROP INDEX \`IDX_a74e0e525737469ee0a512505f\` ON \`usuarios\``);
        await queryRunner.query(`DROP INDEX \`IDX_446adfc18b35418aac32ae0b7b\` ON \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`estoque_insumos\``);
        await queryRunner.query(`DROP TABLE \`financas\``);
        await queryRunner.query(`DROP TABLE \`sementes\``);
        await queryRunner.query(`DROP INDEX \`REL_104f412e768d4a02a954f86129\` ON \`plantacoes\``);
        await queryRunner.query(`DROP INDEX \`IDX_f9d433f426527a5155849342fa\` ON \`plantacoes\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c9028317dfc80980295e9c684\` ON \`plantacoes\``);
        await queryRunner.query(`DROP INDEX \`IDX_4eae007a2eca549e33ea8f9a54\` ON \`plantacoes\``);
        await queryRunner.query(`DROP TABLE \`plantacoes\``);
        await queryRunner.query(`DROP INDEX \`IDX_d649e3616e52585a18bd710263\` ON \`plantas\``);
        await queryRunner.query(`DROP TABLE \`plantas\``);
    }

}
