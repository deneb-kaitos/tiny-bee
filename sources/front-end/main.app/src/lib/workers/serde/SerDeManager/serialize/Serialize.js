// import flatbuffers from 'flatbuffers';
import { Builder } from "flatbuffers";
import {
  serialize as createAccountRegistrationRequest,
} from "@deneb-kaitos/serialize_account_registration_request";
import {
  MessageType,
} from '$lib/workers/serde/SerDeManager/MessageType.js';

export class Serialize {
  #builder = null;
  #handlers = Object.freeze({
    [MessageType.AccountRegistrationRequest]: (payload) => createAccountRegistrationRequest(this.#builder, payload.username, payload.password, payload.pin),
  });

  constructor() {
    this.#builder = new Builder(0);

    console.debug(`${this.constructor.name}.ctor::#builder`, this.#builder);
  }

  serialize(message = null) {
    if (message === null) {
      throw new ReferenceError('message is undefined');
    }

    const {
      payload,
    } = message;

    try {
      return (this.#handlers[payload.type])(payload);
    } catch(error) {
      console.error(error);

      return null;
    }
  }
}