import { Inject, Injectable } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import {
  validate,
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

export const validateDto = async (
  dtoSchema: ClassConstructor<any>,
  plainObject: object,
) => {
  const transformPlainObjToClassInstance = plainToClass(dtoSchema, plainObject);

  const errors = await validate(transformPlainObjToClassInstance);

  if (errors.length) {
    const transformedErrors = [];

    errors.forEach(({ constraints }) => {
      transformedErrors.push(...Object.values(constraints));
    });

    return { message: transformedErrors, status: false };
  }

  return { message: null, status: true };
};
