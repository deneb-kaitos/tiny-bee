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
  createAccountRegistrationRequest,
} from '../serializers/AccountRegistrationRequest/createAccountRegistrationRequest.js';
import {
  deserializeAccountRegistrationRequest,
} from '../deserializers/AccountRegistrationRequest/deserializeAccountRegistrationRequest.js';

describe('serializers', () => {
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

  it('should serialize/deserialize AccountRegistrationMessage', async () => {
    const expectedMessage = {
      login: randomUUID(),
      password: randomUUID(),
      pin: randomUUID(),
    };
    const serializedBytes = createAccountRegistrationRequest(builder, expectedMessage.login, expectedMessage.password, expectedMessage.pin);
    const deserializedMessage = deserializeAccountRegistrationRequest(serializedBytes);

    expect(deserializedMessage).to.deep.equal(expectedMessage);
  });
});