import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTaskTable1718215398005 implements MigrationInterface {
  name = "AlterTaskTable1718215398005";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "categories"`);
    await queryRunner.query(`ALTER TABLE "task" ADD "categories" text array NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "categories"`);
    await queryRunner.query(`ALTER TABLE "task" ADD "categories" character varying(64) NOT NULL`);
  }
}
