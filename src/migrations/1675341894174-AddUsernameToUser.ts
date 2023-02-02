import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsernameToUser1675341894174 implements MigrationInterface {
    name = 'AddUsernameToUser1675341894174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }

}
