import {MigrationInterface, QueryRunner} from "typeorm";

export class newDataa1628655166004 implements MigrationInterface {
    name = 'newDataa1628655166004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "nombre" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "nombre" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "edad" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "edad" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "clave" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "clave" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "clave" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "clave" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "edad" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "edad" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "nombre" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "nombre" SET NOT NULL`);
    }

}
