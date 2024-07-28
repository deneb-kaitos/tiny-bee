import {
  Message
} from '@deneb-kaitos/tiny-bee-fbs/generated/mjs/generated/ts/tinybee/message.js';
import {
  MessagePayload,
} from '@deneb-kaitos/tiny-bee-fbs/generated/mjs/generated/ts/tinybee/message-payload.js';
import {
  AccountRegistrationRequest,
} from '@deneb-kaitos/tiny-bee-fbs/generated/mjs/generated/ts/tinybee/account-registration-request.js';

export const createAccountRegistrationRequest = (
  /**
   * @type {flatbuffers.Builder}
   */
  builder = null,
  /**
   * @type {string}
   */
  login = null,
  /**
   * @type {string}
   */
  password = null,
  /**
   * @type {string}
   */
  pin = null,
) => {
  const loginOffset = builder.createString(login);
  const passwordOffset = builder.createString(password);
  const pinOffset = builder.createString(pin);

  const accountRegistrationRequestOffset = AccountRegistrationRequest.createAccountRegistrationRequest(builder, loginOffset, passwordOffset, pinOffset);
  const messageOffset = Message.createMessage(builder, MessagePayload.AccountRegistrationRequest, accountRegistrationRequestOffset);

  Message.finishMessageBuffer(builder, messageOffset);

  return builder.asUint8Array();
};
