import util from 'node:util';
import {
  randomUUID,
} from 'node:crypto';
import {
  before,
  after,
  describe,
  it,
} from 'node:test';
import assert from 'node:assert/strict';
import flatbuffers from 'flatbuffers';
import {
  MessagePayload,
} from '@deneb-kaitos/tiny-bee-fbs-js/tinybee/message-payload.js';
import {
  serialize as createAccountRegistrationRequest,
} from '@deneb-kaitos/serialize_account_registration_request';
import {
  deserialize as deserializeAccountRegistrationRequest,
} from '../deserialize.mjs';

describe('deserializers', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const debuglog = util.debuglog('serde:specs');
  /** @type {flatbuffers.Builder} */
  let builder = null;

  before(() => {
    builder = new flatbuffers.Builder(0);
  });

  after(() => {
    builder = undefined;
  });

  it('should serialize/deserialize AccountRegistrationMessage', { skip: false }, async () => {
    const expectedMessage = {
      login: randomUUID(),
      password: randomUUID(),
      pin: randomUUID(),
    };
    const serializedBytes = createAccountRegistrationRequest(builder, expectedMessage.login, expectedMessage.password, expectedMessage.pin);

    const deserializedMessage = deserializeAccountRegistrationRequest(serializedBytes);

    assert.deepEqual(deserializedMessage, expectedMessage, 'not equal');
  });

  it('should fail to deserialize AccountRegistrationMessage', { skip: false }, async () => {
    // the next must be 0, which the Uint8Array contains zeros
    const unexpectedMessageType = 0;
    const serializedBytes = new Uint8Array(1000);

    assert.throws(
      () => {
        deserializeAccountRegistrationRequest(serializedBytes);
      },
      (err) => {
        assert(err instanceof TypeError);
        assert.equal(err.message, `unexpected message type: ${unexpectedMessageType}; expected ${MessagePayload.AccountRegistrationRequest}`);

        return true;
      }
    );
  });
});
