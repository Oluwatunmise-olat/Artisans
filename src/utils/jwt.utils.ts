import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as JWT from 'jsonwebtoken';
import { JWT_TOKEN } from 'src/typings';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  generateAccessToken(payload: JWT_TOKEN) {
    return JWT.sign(payload, this.configService.get('SECRET_KEY')); // Non expiring token
  }
}
