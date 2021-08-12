import {MigrationInterface, QueryRunner} from "typeorm";

export class addedReservas1628664995373 implements MigrationInterface {
    name = 'addedReservas1628664995373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reserva" ("id" SERIAL NOT NULL, "uid" integer DEFAULT '0', "cantidad_jugos" integer DEFAULT '0', "precio_total" integer DEFAULT '0', "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_37909c9a3ea6a72ee6f21b16129" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "reserva"`);
    }

}
