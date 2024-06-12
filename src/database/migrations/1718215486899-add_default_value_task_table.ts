import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultValueTaskTable1718215486899 implements MigrationInterface {
  name = "AddDefaultValueTaskTable1718215486899";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "categories" SET DEFAULT '{}'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "categories" DROP DEFAULT`);
  }
}
