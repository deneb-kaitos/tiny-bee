import assert from 'node:assert/strict';
import {
  randomUUID,
} from 'node:crypto';
import {
  describe,
  it,
  beforeEach,
} from 'node:test';
import {
  getServerConfig,
} from './helpers/getServerConfig.mjs';
import {
  Proto,
} from '../Proto.mjs';

describe('getServerConfig', () => {
  const expectedProtos = Object.freeze(Object.values(Proto));

  beforeEach(() => {
    process.env.WS_HOST = '127.0.0.1';
    process.env.WS_PORT = 9090;
    process.env.WS_PROTO = Proto.WS;
  });

  it('should construct a ServerConfig', { skip: false }, () => {
    const config = getServerConfig();

    assert.deepEqual(config, {
      server: {
        host: process.env.WS_HOST,
        port: parseInt(process.env.WS_PORT),
        proto: process.env.WS_PROTO,
      },
    });
  });

  it('should fail due to host undefined', { skip: false }, () => {
    delete process.env.WS_HOST;

    assert.throws(
      () => {
        getServerConfig();
      },
      (err) => {
        assert(err instanceof ReferenceError);
        assert.equal(err.message, 'host is undefined');

        return true;
      },
    );
  });

  it('should fail due to port undefined', { skip: false }, () => {
    delete process.env.WS_PORT;

    assert.throws(
      () => {
        getServerConfig();
      },
      (err) => {
        assert(err instanceof ReferenceError);
        assert.equal(err.message, 'port is undefined');

        return true;
      },
    );
  });

  it('should fail due to proto undefined', { skip: false }, () => {
    delete process.env.WS_PROTO;

    assert.throws(
      () => {
        getServerConfig();
      },
      (err) => {
        assert(err instanceof ReferenceError);
        assert.equal(err.message, 'proto is undefined');

        return true;
      },
    );
  });

  it(`should fail due to proto not one of [${expectedProtos.join(', ')}]`, { skip: false }, () => {
    process.env.WS_PROTO = randomUUID();

    assert.throws(
      () => {
        getServerConfig();
      },
      (err) => {
        assert(err instanceof RangeError);
        assert.equal(err.message, `proto is not one of [${expectedProtos.join(', ')}]`);

        return true;
      },
    );
  });
});