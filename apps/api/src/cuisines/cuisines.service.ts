// cuisines.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';

@Injectable()
export class CuisinesService {
  constructor(@Inject('DB') private db: NeonHttpDatabase<typeof schema>) {}

  findAll() {
    return this.db.select().from(schema.cuisines);
  }
}
