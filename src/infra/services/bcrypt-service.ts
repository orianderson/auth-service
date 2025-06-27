import { IBcryptService } from '../../core';
import * as bcrypt from 'bcrypt';

export class BcryptService implements IBcryptService {
  private readonly saltRounds: number = 12;

  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
