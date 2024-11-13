import {
  env,
} from 'node:process';
import {
  before,
  after,
  describe,
  it,
} from 'node:test';
import assert from 'node:assert/strict';
import {
  createClient,
} from '@redis/client';
import {
  LibRedisStreamWriter,
} from '../LibRedisStreamWriter.mjs';

describe('LibRedisWriter', function describeLibRedisWriter() {
  /**
   * 
   * @type {import('@redis/client').RedisClientOptions} redisConfig
   */
  const redisConfig = Object.freeze({
    socket: {
      port: parseInt(env.REDIS_SOCKET_PORT),
      host: env.REDIS_SOCKET_HOST,
      family: parseInt(env.REDIS_SOCKET_FAMILY),
      connectTimeout: parseInt(env.REDIS_SOCKET_CONNECT_TIMEOUT),
      noDelay: true,
      keepAlive: true,
      keepAliveInitialDelay: parseInt(env.REDIS_SOCKET_KEEPALIVEINITIALDELAY),
      tls: false,
      reconnectStrategy: (retries) => {
        const jitter = Math.floor(Math.random() * 200);
        const delay = Math.min(Math.pow(2, retries) * 50, 2000);

        return delay + jitter;
      },
    },
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
    name: env.REDIS_CLIENT_NAME,
    database: parseInt(env.REDIS_DB),
  });
  let libRedisStreamWriter = null;
  let specsRedisClient = null; 
  const redisKeys = [];
  const clearRedis = (keys = []) => {

  }; 

  before(async () => {
    libRedisStreamWriter = new LibRedisStreamWriter(redisConfig);
    await libRedisStreamWriter.start();
  });

  after(async () => {
    libRedisStreamWriter.stop();
    libRedisStreamWriter = null;

    specsRedisClient = createClient(redisConfig);
    await specsRedisClient.connect();
    await specsRedisClient.unlink(redisKeys.join(' '));
    specsRedisClient.destroy();

    specsRedisClient = undefined;
  });

  it('should write client message to the Incoming Stream', async() => {
    const streamName = `stream:${crypto.randomUUID()}`
    const record = {
      sid: `sid:${crypto.randomUUID()}`,
      cid: `cid:${crypto.randomUUID()}`,
      payload: Buffer.from(`payload:${crypto.randomUUID()}`),
    };
    redisKeys.push(streamName);

    await libRedisStreamWriter.write(streamName, record);
  });
});
