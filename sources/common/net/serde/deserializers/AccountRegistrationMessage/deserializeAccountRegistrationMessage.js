import flatbuffers from 'flatbuffers';
import {
  Message
} from '@deneb-kaitos/tiny-bee-fbs/generated/mjs/generated/ts/tinybee/message.js';
import {
  MessagePayload,
} from '@deneb-kaitos/tiny-bee-fbs/generated/mjs/generated/ts/tinybee/message-payload.js';
import {
  AccountRegistrationMessage,
} from '@deneb-kaitos/tiny-bee-fbs/generated/mjs/generated/ts/tinybee/account-registration-message.js';

const PAYLOAD_TYPE = MessagePayload.AccountRegistrationMessage;

export const deserializeAccountRegistrationMessage = (
  /**
   * @type {Uint8Array}
   */
  byteArray = null
) => {
  const messageRoot = Message.getRootAsMessage(new flatbuffers.ByteBuffer(byteArray));
  const payloadType = messageRoot.payloadType();

  if (payloadType === MessagePayload.AccountRegistrationMessage) {
    const accountRegistrationMessage = messageRoot.payload(new AccountRegistrationMessage());
    const result = {
      login: accountRegistrationMessage.login(),
      password: accountRegistrationMessage.password(),
      pin: accountRegistrationMessage.pin(),
    };

    return result;
  }

  throw new TypeError(`unexpected message type: ${payloadType}; expected ${MessagePayload.AccountRegistrationMessage}`);
};