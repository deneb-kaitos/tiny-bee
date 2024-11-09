import { Builder } from "flatbuffers";
import {
  serialize as createAccountRegistrationRequest,
} from "@deneb-kaitos/serialize_account_registration_request";
import { createBroadcastMessage } from '$lib/workers/helpers/createBroadcastMessage.js';
import {
  OperationType,
} from '$lib/workers/serde/SerDeManager/OperationType.js';
import {
  AccountRegistrationRequest,
} from '$lib/workers/serde/SerDeManager/classes/AccountRegistrationRequest.js';
import {
  AccountAuthenticationRequest,
} from '$lib/workers/serde/SerDeManager/classes/AccountAuthenticationRequest.js';

const serdeMap = {
  [OperationType.serialize]: {
    [AccountRegistrationRequest.name]: (builder, username, password, pin) => createAccountRegistrationRequest(builder, username, password, pin),
    [AccountAuthenticationRequest.name]: () => { throw new ReferenceError(`serialization of ${AccountAuthenticationRequest.name} has not been implemented yet`) },
  },
};

export class SerDeManager {
  #builder = null;
  #name = null;
  #channels = null;

  constructor(name = null) {
    this.#name = `${name}::SerDeManager`
    this.#builder = new Builder(0);
    this.#channels = new Map();

    console.debug(`${this.#name}.ctor`);
  }

  /**
   * 
   * @param {string} channelName 
   * @returns {BroadcastChannel}
   */
  #resolveChannel(channelName = null) {
    if (channelName === null || channelName.length === 0) {
      throw new ReferenceError(`${this.constructor.name}.#resolveChannel(channelName === null)`);
    }

    if (this.#channels.has(channelName) === true) {
      return this.#channels.get(channelName);
    }

    this.#channels.set(channelName, new BroadcastChannel(channelName));

    return this.#channels.get(channelName);
  }

  serialize(message = null) {
    const {
      meta: {
        returnTo,
      },
      payload: {
        username,
        password,
        pin,
      },
    } = message;

    try {
      const bytes = ((serdeMap[OperationType.serialize])[message.payload.type])(this.#builder, username, password, pin);

      if (returnTo) {
        const m = createBroadcastMessage({
          type: message.payload.type,
          meta: Object.create(null),
          payload: bytes,
        });

        this.#resolveChannel(message.meta.returnTo).postMessage(m);
      }
    } catch(notImplementedError) {
      console.error(notImplementedError);
    }
  }

  destructor() {
    for (const channel of this.#channels.values()) {
      console.debug(`closing ${channel.name}`);

      channel?.close();
    }

    this.#channels.clear();
    this.#channels = undefined;

    this.#builder = undefined;
    this.#name = undefined;
  }
}