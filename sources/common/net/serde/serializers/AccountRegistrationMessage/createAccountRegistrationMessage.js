import {
  Message
} from '@deneb-kaitos/tiny-bee-fbs/generated/mjs/generated/ts/tinybee/message.js';
import {
  MessagePayload,
} from '@deneb-kaitos/tiny-bee-fbs/generated/mjs/generated/ts/tinybee/message-payload.js';
import {
  AccountRegistrationMessage,
} from '@deneb-kaitos/tiny-bee-fbs/generated/mjs/generated/ts/tinybee/account-registration-message.js';

export const createAccountRegistrationMessage = (
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

  const accountRegistrationMessageOffset = AccountRegistrationMessage.createAccountRegistrationMessage(builder, loginOffset, passwordOffset, pinOffset);
  const messageOffset = Message.createMessage(builder, MessagePayload.AccountRegistrationMessage, accountRegistrationMessageOffset);

  Message.finishMessageBuffer(builder, messageOffset);

  return builder.asUint8Array();
};
