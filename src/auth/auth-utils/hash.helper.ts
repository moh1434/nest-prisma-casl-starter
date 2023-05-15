import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class HashService {
  async hash(plan: string) {
    return await hash(plan, 8);
  }

  async compare(plan: string, hashed: string) {
    return compare(plan, hashed);
  }
}
