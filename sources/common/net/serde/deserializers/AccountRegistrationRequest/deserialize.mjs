import { ByteBuffer } from 'flatbuffers';
import {
  Message
} from '@deneb-kaitos/tiny-bee-fbs-js/tinybee/message.js';
import {
  MessagePayload,
} from '@deneb-kaitos/tiny-bee-fbs-js/tinybee/message-payload.js';
import {
  AccountRegistrationRequest,
} from '@deneb-kaitos/tiny-bee-fbs-js/tinybee/account-registration-request.js';

export const deserialize = (
  /**
   * @type {Uint8Array}
   */
  byteArray = null
) => {
  const messageRoot = Message.getRootAsMessage(new ByteBuffer(byteArray));
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