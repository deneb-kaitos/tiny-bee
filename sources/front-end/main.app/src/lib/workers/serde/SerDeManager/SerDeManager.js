import {
  Serialize,
} from './serialize/Serialize.js';

export class SerDeManager {
  #serializer = null;

  constructor() {
    this.#serializer = new Serialize();

    console.debug(`${this.constructor.name}.ctor`);
  }

  serialize(message = null) {
    const {
      meta: {
        returnTo = null,
      },
    } = message;
    const result = this.#serializer.serialize(message);

    console.debug(`${this.constructor.name}.serialize:`, message, result);

    if (returnTo !== null) {
      (new BroadcastChannel(returnTo)).postMessage({
        type: message.payload.type,
        payload: result,
      });
    } 
  }
}