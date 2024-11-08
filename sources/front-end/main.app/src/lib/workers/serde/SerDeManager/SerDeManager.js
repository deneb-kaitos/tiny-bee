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
    [AccountAuthenticationRequest.name]: (builder, username, password) => { throw new ReferenceError(`serialization of ${AccountAuthenticationRequest.name} has not been implemented yet`) },
  },
};

export class SerDeManager {
  #builder = null;
  #name = null;

  constructor(name = null) {
    this.#name = `${name}::SerDeManager`
    this.#builder = new Builder(0);

    console.debug(`${this.#name}.ctor`);
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

    try {
      bytes = ((serdeMap[OperationType.serialize])[message.payload.type])(this.#builder, username, password, pin);

      if (returnTo) {
        const m = createBroadcastMessage({
          type: message.payload.type,
          meta: null,
          payload: bytes,
        });

        (new BroadcastChannel(message.meta.returnTo)).postMessage(m);
      }

      bytes = undefined;
    } catch(notImplementedError) {
      console.error(notImplementedError);
    }
  }
}