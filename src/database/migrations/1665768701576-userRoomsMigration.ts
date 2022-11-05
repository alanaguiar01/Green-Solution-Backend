import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class userRoomsMigration1665768701576 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users_rooms',
        columns: [
          { name: 'room_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'users_rooms',
      new TableForeignKey({
        columnNames: ['room_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'rooms',
        name: 'fk_rooms_users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'users_rooms',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        name: 'fk_users_rooms',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users_rooms', 'fk_rooms_users');
    await queryRunner.dropForeignKey('users_rooms', 'fk_users_rooms');
    await queryRunner.dropTable('users_rooms');
  }
}
