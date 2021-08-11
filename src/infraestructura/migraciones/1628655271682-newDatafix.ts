import {MigrationInterface, QueryRunner} from "typeorm";

export class newDatafix1628655271682 implements MigrationInterface {
    name = 'newDatafix1628655271682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "acumulacionComprasMensual" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "acumulacionComprasMensual" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "acumulacionComprasMensual" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "acumulacionComprasMensual" SET NOT NULL`);
    }

}
