import flatbuffers from 'flatbuffers';
import {
  Message
} from '@deneb-kaitos/tiny-bee-fbs/generated/mjs/generated/ts/tinybee/message.js';
import {
  MessagePayload,
} from '@deneb-kaitos/tiny-bee-fbs/generated/mjs/generated/ts/tinybee/message-payload.js';
import {
  AccountRegistrationRequest,
} from '@deneb-kaitos/tiny-bee-fbs/generated/mjs/generated/ts/tinybee/account-registration-request.js';

export const deserialize = (
  /**
   * @type {Uint8Array}
   */
  byteArray = null
) => {
  const messageRoot = Message.getRootAsMessage(new flatbuffers.ByteBuffer(byteArray));
  const payloadType = messageRoot.payloadType();

  if (payloadType === MessagePayload.AccountRegistrationRequest) {
    const accountRegistrationRequest = messageRoot.payload(new AccountRegistrationRequest());
    const result = {
      login: accountRegistrationRequest.login(),
      password: accountRegistrationRequest.password(),
      pin: accountRegistrationRequest.pin(),
    };

    return result;
  }

  throw new TypeError(`unexpected message type: ${payloadType}; expected ${MessagePayload.AccountRegistrationRequest}`);
};