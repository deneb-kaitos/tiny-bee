import { createBroadcastMessage } from '$lib/workers/helpers/createBroadcastMessage.js';
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

    if (returnTo !== null) {
      const m = createBroadcastMessage({
        type: message.payload.type,
        meta: null,
        payload: result,
      });
      (new BroadcastChannel(returnTo)).postMessage(m);
    } 
  }
}