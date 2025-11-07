import Redis from "ioredis";

let redis = null;

export const getRedisClient = () => {
  if (!redis) {
    redis = new Redis({
      host: "localhost",
      port: 6379,
      db: 0,
    });
  }
  return redis;
};

export const closeRedisConnection = async () => {
  if (redis) {
    await redis.quit();
    redis = null;
  }
};