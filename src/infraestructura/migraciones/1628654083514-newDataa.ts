import {MigrationInterface, QueryRunner} from "typeorm";

export class newDataa1628654083514 implements MigrationInterface {
    name = 'newDataa1628654083514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "edad" integer NOT NULL, "clave" character varying NOT NULL, "fechaUltimaCompra" TIMESTAMP NOT NULL DEFAULT now(), "acumulacionComprasMensual" integer NOT NULL, "fechaCreacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuario"`);
    }

}
