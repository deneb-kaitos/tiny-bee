import { Builder } from "flatbuffers";
import {
  serialize as createAccountRegistrationRequest,
} from "@deneb-kaitos/serialize_account_registration_request";
import { createBroadcastMessage } from '$lib/workers/helpers/createBroadcastMessage.js';
// import {
//   OperationType,
// } from '$lib/workers/serde/SerDeManager/OperationType.js';
import {
  AccountRegistrationRequest,
} from '$lib/workers/serde/SerDeManager/classes/AccountRegistrationRequest.js';
import {
  AccountAuthenticationRequest,
} from '$lib/workers/serde/SerDeManager/classes/AccountAuthenticationRequest.js';

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

    let bytes = null;

    switch(message.payload.type) {
      case AccountRegistrationRequest.name: {
        bytes = createAccountRegistrationRequest(this.#builder, username, password, pin);

        break;
      }
      default: {
        throw new TypeError(`serialization for ${message.payload.type} has not been implemented yet`);
      }
    }

    if (returnTo) {
      const m = createBroadcastMessage({
        type: message.payload.type,
        meta: Object.create(null),
        payload: bytes,
      });

      this.#resolveChannel(message.meta.returnTo).postMessage(m);
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