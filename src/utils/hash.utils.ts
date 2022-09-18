import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class Hash {
  options = {
    saltRound: 10,
  };

  verify(plainText: string, hashedText: string) {
    return bcrypt.compare(plainText, hashedText);
  }

  make(plainText: string) {
    const salt = bcrypt.genSaltSync(this.options.saltRound);

    return bcrypt.hash(plainText, salt);
  }
}
