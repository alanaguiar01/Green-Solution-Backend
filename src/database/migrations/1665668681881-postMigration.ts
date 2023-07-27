import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class postMigration1665668681881 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'INTERGER',
            length: '255',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.addColumn(
      'posts',
      new TableColumn({
        name: 'profile_id',
        type: 'uuid',
      }),
    );

    await queryRunner.addColumn(
      'posts',
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'post',
      new TableForeignKey({
        columnNames: ['profile_id'],
        referencedColumnNames: ['id'],
        name: 'fk_profile_post',
        referencedTableName: 'profiles',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        name: 'fk_category_post',
        referencedTableName: 'categories',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('post', 'fk_profile_post');
    await queryRunner.dropColumn('post', 'profile_id');
    await queryRunner.dropForeignKey('categories', 'fk_category_post');
    await queryRunner.dropColumn('categories', 'category_id');
    await queryRunner.dropTable('post');
  }
}
