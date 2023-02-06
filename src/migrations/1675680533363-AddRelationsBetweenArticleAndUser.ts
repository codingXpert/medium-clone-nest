import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationsBetweenArticleAndUser1675680533363 implements MigrationInterface {
    name = 'AddRelationsBetweenArticleAndUser1675680533363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ADD "authorId" integer`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "authorId"`);
    }

}

// Before working with migrations , add these lines in package.json(inside "scripts")
// "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d src/ormdatasource.ts",
//     "db:drop": "npm run typeorm schema:drop",
//     "db:create": "npm run typeorm migration:generate",
//     "db:migrate": "npm run typeorm migration:run"



// For adding relation between user table & articles table we need to create new migration as:
// npm run db:create src/migrations/AddRelationsBetweenArticleAndUser.... (AddRelationsBetweenArticleAndUser) is the name of migration or table


// after establishing relation (or after creation of migration) . run the following command
// npm run db:migrate
