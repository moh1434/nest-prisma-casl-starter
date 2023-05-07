import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class PasswordHashService {
  async hash(plan: string) {
    return await hash(plan, 8);
  }

  async compare(plan: string, hashed: string) {
    return compare(plan, hashed);
  }
}
