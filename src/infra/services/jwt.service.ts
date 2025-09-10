import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';

import { IJwtService } from '@core/services';
import { DecodeOptions, JwtPayload, Options } from '@core/@types';
import { Either, left, right } from '@core/helpers';
import {
  ExpiredTokenError,
  InvalidOptionsError,
  InvalidSignatureError,
} from '@core/errors';

const jwtOptionsFields: Array<keyof Options> = ['secret', 'expiresIn'];

export class JwtService implements IJwtService {
  private validadeOptions(options: Options): Either<InvalidOptionsError, true> {
    for (const item of jwtOptionsFields) {
      if (!options[item]) {
        return left(new InvalidOptionsError());
      }
    }

    return right(true);
  }

  createToken(payload: object, options: Options): string {
    const validation = this.validadeOptions(options);
    if (validation.isLeft()) {
      throw validation.value;
    }

    const signOptions: SignOptions = {};
    // Type guard: options is Options here because validation isRight
    if (
      typeof options === 'object' &&
      options !== null &&
      'expiresIn' in options &&
      options.expiresIn
    ) {
      // Ensure expiresIn is a number or StringValue (e.g., '1h', '2d')
      signOptions.expiresIn = options.expiresIn as SignOptions['expiresIn'];
    }

    const token = jwt.sign(payload, options.secret as jwt.Secret, signOptions);

    return token;
  }
  checkToken(
    token: string,
    secret: string,
  ): Either<InvalidSignatureError | ExpiredTokenError, JwtPayload> {
    try {
      return right(jwt.verify(token, secret) as JwtPayload);
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        typeof (err as { message: unknown }).message === 'string' &&
        (err as { message: string }).message === 'invalid signature'
      ) {
        return left(new InvalidSignatureError());
      } else {
        return left(new ExpiredTokenError());
      }
    }
  }

  decodeToken(token: string, options: DecodeOptions): any {
    return jwt.decode(token, options);
  }
}
