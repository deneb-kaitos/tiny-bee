import {
  Message
} from '@deneb-kaitos/tiny-bee-fbs/generated/js/tinybee/message.js';
import {
  MessagePayload,
} from '@deneb-kaitos/tiny-bee-fbs/generated/js/tinybee/message-payload.js';
import {
  AccountRegistrationRequest,
} from '@deneb-kaitos/tiny-bee-fbs/generated/js/tinybee/account-registration-request.js';

export const serialize = (
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
