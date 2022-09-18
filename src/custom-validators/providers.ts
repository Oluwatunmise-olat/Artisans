import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AccountsService } from 'src/accounts/accounts.service';

@ValidatorConstraint({ name: 'isUserWithEmailExists', async: true })
@Injectable()
export class IsUserExistsWithEmail implements ValidatorConstraintInterface {
  @Inject(AccountsService)
  private readonly accountsService: AccountsService;

  message = 'Email already taken';

  async validate(fieldValue: any): Promise<boolean> {
    const { status } = await this.accountsService.userExists({
      email: fieldValue,
    });

    return status ? false : true;
  }
  defaultMessage?(): string {
    return this.message;
  }
}
