import {MigrationInterface, QueryRunner} from "typeorm";

export class newDatafix1628656325615 implements MigrationInterface {
    name = 'newDatafix1628656325615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."usuario" DROP COLUMN "fechaUltimaCompra"`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" DROP COLUMN "fechaCreacion"`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ADD "fecha_ultima_compra" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ADD "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."usuario" DROP COLUMN "fecha_creacion"`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" DROP COLUMN "fecha_ultima_compra"`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ADD "fechaCreacion" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ADD "fechaUltimaCompra" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
