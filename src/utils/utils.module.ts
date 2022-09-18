import { Module } from '@nestjs/common';
import { Hash, APIResponse, JwtService } from '.';

@Module({
  providers: [APIResponse, Hash, JwtService],
  exports: [APIResponse, Hash, JwtService],
})
export class UtilsModule {}
