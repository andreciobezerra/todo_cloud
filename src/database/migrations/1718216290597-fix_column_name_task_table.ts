import { MigrationInterface, QueryRunner } from "typeorm";

export class FixColumnNameTaskTable1718216290597 implements MigrationInterface {
  name = "FixColumnNameTaskTable1718216290597";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "priotity" TO "priority"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "priority" TO "priotity"`);
  }
}
