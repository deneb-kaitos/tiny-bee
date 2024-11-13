import {
  createClient,
} from '@redis/client';

export class LibRedisWriter {
  #redisConfig = null;
  /**
   * @type {RedisClient}
   */
  #redisClient = null;

  /**
   * 
   * @param {import('@redis/client').RedisClientOptions} config 
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

  async stop() {
    return this.#redisClient.destroy();
  }

  async write(streamName = null, message = null) {
    if (streamName === null) {
      throw new ReferenceError(`${this.constructor.name}.write: streamName is undefined`);
    }

    if (message === null) {
      throw new ReferenceError(`${this.constructor.name}.write: message is undefined`);
    }

    return this.#redisClient.xAdd(
      streamName,
      '*',
      message,
      {},
    );
  }
}