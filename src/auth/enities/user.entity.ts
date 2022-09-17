import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  static async createUser(authCredentials: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentials;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = User.create({ username, password: hashedPassword });

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
