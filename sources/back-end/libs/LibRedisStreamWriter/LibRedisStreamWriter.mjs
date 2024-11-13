import {
  createClient,
} from '@redis/client';

export class LibRedisStreamWriter {
  /**
   * @type {import('@redis/client').RedisClientOptions}
   */
  #redisConfig = null;
  /**
   * @type {import('@redis/client').RedisClientType}
   */
  #redisClient = null;

  /**
   * 
   * @param {import('@redis/client').RedisClientOptions} redisConfig
   */
  constructor(redisConfig = null) {
    if (redisConfig === null) {
      throw ReferenceError(`${this.constructor.name}.ctor: config is undefined`);
    }

    this.#redisConfig = redisConfig;
  }

  async start() {
    this.#redisClient = createClient(this.#redisConfig);

    return this.#redisClient.connect();
  }

  stop() {
    this.#redisClient.destroy();
  }

  async write(streamName = null, message = null) {
    if (streamName === null) {
      throw new ReferenceError(`${this.constructor.name}.write: streamName is undefined`);
    }

    if (message === null) {
      throw new ReferenceError(`${this.constructor.name}.write: message is undefined`);
    }

    return this.#redisClient.sendCommand([
      'XADD',
      streamName,
      '*',
      ...Object.entries(message).flat(),
    ]);
  }
}