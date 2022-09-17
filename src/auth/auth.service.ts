import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './enities/user.entity';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signUp(authCredentials: AuthCredentialsDto): Promise<void> {
    return User.createUser(authCredentials);
  }

  async signIn(
    authCredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentials;

    try {
      const user = await User.findOneByOrFail({ username });
      const doesPasswordMatch = await bcrypt.compare(password, user.password);

      if (user && doesPasswordMatch) {
        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);

        console.log({ accessToken });

        return { accessToken };
      }
    } catch (error) {
      console.log(error);
    }
  }
}
