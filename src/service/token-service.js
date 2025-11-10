import jwt from 'jsonwebtoken';
import { getRedisClient } from '../application/redis.js';

const SECRET_KEY = process.env.JWT_SECRET;

const create = async (user) => {
  const redis = getRedisClient();
  const token = jwt.sign({ username: user.username }, SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '1d',
  });

  await redis.setex(token, 24 * 60 * 60, user.username);

  return token;
};

const verify = async (token) => {
  const redis = getRedisClient();

  const value = await redis.get(token);
  if (!value) {
    console.log('Token not found in Redis');
    return null;
  } else {
    return {
      username: value,
    };
  }

  //   try {
  //     const decoded = jwt.verify(token, SECRET_KEY, {
  //       algorithms: 'HS256',
  //     });

  //     return {
  //       username: decoded.username,
  //     };
  //   } catch (error) {
  //     logger.error(error);
  //     return null;
  //   }
};

export default {
  create,
  verify,
};
