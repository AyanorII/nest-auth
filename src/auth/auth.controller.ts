import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @Post('/signup')
  async signUp(@Body() authCredentials: AuthCredentialsDto) {
    return this.authService.signUp(authCredentials);
  }
}
