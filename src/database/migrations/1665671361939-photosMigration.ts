import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class photosMigration1665671361939 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'photos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'url',
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
      'photos',
      new TableColumn({
        name: 'post_id',
        type: 'uuid',
      }),
    );
    await queryRunner.createForeignKey(
      'photos',
      new TableForeignKey({
        columnNames: ['post_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post',
        name: 'fk_photos_post',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('photos', 'fk_photos_post');
    await queryRunner.dropColumn('photos', 'post_id');
    await queryRunner.dropTable('photos');
  }
}
