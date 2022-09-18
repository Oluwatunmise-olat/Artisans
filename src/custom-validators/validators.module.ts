import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { IsUserExistsWithEmail } from './providers';

@Module({
  imports: [AccountsModule],
  providers: [IsUserExistsWithEmail],
})
export class CustomValidatorsModule {}
