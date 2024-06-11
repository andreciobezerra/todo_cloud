import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1718131206765 implements MigrationInterface {
  name = "Initial1718131206765";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(64) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c594e9d84ba5c5b6e920aafb943" UNIQUE ("title"), CONSTRAINT "PK_5a2a57aed53e11558e410ddb44d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(128) NOT NULL, "description" text NOT NULL, "dueDate" TIMESTAMP NOT NULL, "completed" boolean NOT NULL, "priotity" character varying(36) NOT NULL, "evaluation" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(128) NOT NULL, "email" character varying(128) NOT NULL, "password" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_categories_task_category" ("taskId" uuid NOT NULL, "taskCategoryId" uuid NOT NULL, CONSTRAINT "PK_3fcbbc08332fab3cce6d500cd4f" PRIMARY KEY ("taskId", "taskCategoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_07767301d591396316e8efd9a3" ON "task_categories_task_category" ("taskId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_60dee42a4a366f607e9316e3cc" ON "task_categories_task_category" ("taskCategoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_categories_task_category" ADD CONSTRAINT "FK_07767301d591396316e8efd9a30" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_categories_task_category" ADD CONSTRAINT "FK_60dee42a4a366f607e9316e3ccd" FOREIGN KEY ("taskCategoryId") REFERENCES "task_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_categories_task_category" DROP CONSTRAINT "FK_60dee42a4a366f607e9316e3ccd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_categories_task_category" DROP CONSTRAINT "FK_07767301d591396316e8efd9a30"`,
    );
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_60dee42a4a366f607e9316e3cc"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_07767301d591396316e8efd9a3"`);
    await queryRunner.query(`DROP TABLE "task_categories_task_category"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TABLE "task_category"`);
  }
}
