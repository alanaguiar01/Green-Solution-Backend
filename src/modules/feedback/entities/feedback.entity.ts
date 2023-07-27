import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntityModel } from '~/common/baseModel';

@Entity()
export class Feedback extends BaseEntityModel {
  @Column({ nullable: true })
  @ApiProperty()
  type: string;

  @Column({ nullable: true })
  @ApiProperty()
  comment: string;

  @Column({ nullable: false })
  @ApiPropertyOptional()
  screenshot: string;
}
