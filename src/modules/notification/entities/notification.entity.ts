import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntityModel } from '~/common/baseModel';

@Entity()
export class Notification extends BaseEntityModel {
  @Column({ nullable: true })
  @ApiProperty()
  text: string;

  @Column({ nullable: true })
  @ApiProperty()
  sender: string;

  @Column({ nullable: true })
  @ApiPropertyOptional()
  receiver: string;
}
