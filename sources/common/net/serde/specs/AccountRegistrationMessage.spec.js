import util from 'node:util';
import {
  randomUUID,
} from 'node:crypto';
import {
  before,
  after,
  describe,
  it,
} from 'mocha';
import {
  expect,
} from 'chai';
import flatbuffers from 'flatbuffers';
import {
  createAccountRegistrationMessage,
} from '../serializers/AccountRegistrationMessage/createAccountRegistrationMessage.js';
import {
  deserializeAccountRegistrationMessage,
} from '../deserializers/AccountRegistrationMessage/deserializeAccountRegistrationMessage.js';

describe('serializers', () => {
  const debuglog = util.debuglog('serde:specs');
  /** @type {flatbuffers.Builder} */
  let builder = null;

  before(() => {
    builder = new flatbuffers.Builder(0);
  });

  after(() => {
    builder = undefined;
  });

  it('should serialize/deserialize AccountRegistrationMessage', async () => {
    const expectedMessage = {
      login: randomUUID(),
      password: randomUUID(),
      pin: randomUUID(),
    };

    const serializedBytes = createAccountRegistrationMessage(builder, expectedMessage.login, expectedMessage.password, expectedMessage.pin);
    const deserializedMessage = deserializeAccountRegistrationMessage(serializedBytes);

    debuglog({ serializedBytes });
    debuglog({ deserializedMessage });

    expect(deserializedMessage).to.deep.equal(expectedMessage);
  });
});
