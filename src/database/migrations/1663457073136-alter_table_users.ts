import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTableUsers1663457073136 implements MigrationInterface {
  name?: string = 'alter_table_users1663457073136';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            ALTER TABLE users ADD password VARCHAR(500) NOT NULL
        ;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // don't drop password column
    return null;
  }
}
