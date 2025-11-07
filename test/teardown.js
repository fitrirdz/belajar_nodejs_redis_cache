import {closeRedisConnection} from '../src/application/redis.js';
import {prismaClient} from '../src/application/database.js';

export default async function globalTeardown() {
  // Close Redis connection
  await closeRedisConnection();
  
  // Close Prisma connection
  await prismaClient.$disconnect();
}