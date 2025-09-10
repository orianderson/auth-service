import { DecodeOptions, JwtPayload, Options } from '../@types';
import { Either } from '../helpers';

export interface IJwtService {
  createToken(payload: object, options: Options): string;
  checkToken(token: string, secret: string): Either<Error, JwtPayload>;
  decodeToken(token: string, options: DecodeOptions): any;
}
