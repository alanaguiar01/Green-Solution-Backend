import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'reset-password' })
export class ResetPassword {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  email: string;
  @Column()
  token: string;
}
