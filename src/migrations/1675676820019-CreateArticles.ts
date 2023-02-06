import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateArticles1675676820019 implements MigrationInterface {
    name = 'CreateArticles1675676820019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "articles" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "body" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tagList" text NOT NULL, "favoritesCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "articles"`);
    }

}

// Before working with migrations , add these lines in package.json(inside "scripts")
// "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d src/ormdatasource.ts",
//     "db:drop": "npm run typeorm schema:drop",
//     "db:create": "npm run typeorm migration:generate",
//     "db:migrate": "npm run typeorm migration:run"

// to create migration run the following command :-
// npm run db:create src/migrations/CreateArticles    (CreateArticles is migration name)

// to run migration run the following command :- 
// npm run db:migrate

// to delete the migration run the following command:-
// npm run db:drop
