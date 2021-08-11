import {MigrationInterface, QueryRunner} from "typeorm";

export class newDatafix1628656161496 implements MigrationInterface {
    name = 'newDatafix1628656161496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."usuario" RENAME COLUMN "acumulacionComprasMensual" TO "acumulacion_compras_mensual"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."usuario" RENAME COLUMN "acumulacion_compras_mensual" TO "acumulacionComprasMensual"`);
    }

}
