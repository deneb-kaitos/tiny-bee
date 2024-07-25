import assert from 'node:assert/strict';
import {
  randomUUID,
} from 'node:crypto';
import {
  describe,
  it,
} from 'node:test';
import {
  Proto,
} from '../Proto.mjs';
import {
  createWsConnectionString,
} from './helpers/createWsConnectionString.mjs';

describe('createWsConnectionString', () => {
  const connectionStringArgs = {
    proto: Proto.WSS,
    host: '127.0.0.1',
    port: 9090,
    path: '/',
  };

  it('should createWsConnectionString', { skip: false}, async () => {
    const c = createWsConnectionString({
      proto: connectionStringArgs.proto,
      host: connectionStringArgs.host,
      port: connectionStringArgs.port,
      path: connectionStringArgs.path,
    });

    assert.equal(c, `${connectionStringArgs.proto}://${connectionStringArgs.host}:${connectionStringArgs.port}${connectionStringArgs.path}`);
  });

  it('should fail w/ proto is NULL error', { skip: false }, async () => {
    const incorrectProtoArgs = structuredClone(connectionStringArgs);
    delete incorrectProtoArgs.proto;

    assert.throws(
      () => {
        createWsConnectionString({
          proto: incorrectProtoArgs.proto,
          host: incorrectProtoArgs.host,
          port: incorrectProtoArgs.port,
          path: incorrectProtoArgs.path,
        });
      },
      (err) => {
        assert(err instanceof ReferenceError);
        assert.equal(err.message, 'proto is NULL');

        return true;
      });
  });

  it(`should fail w/ proto is neither of [${Object.values(Proto).join(', ')}]`, { skip: false }, async () => {
    const incorrectProtoArgs = structuredClone(connectionStringArgs);
    incorrectProtoArgs.proto = randomUUID();

    assert.throws(
      () => {
        createWsConnectionString({
          proto: incorrectProtoArgs.proto,
          host: incorrectProtoArgs.host,
          port: incorrectProtoArgs.port,
          path: incorrectProtoArgs.path,
        });
      },
      (err) => {
        assert(err instanceof RangeError);
        // assert.equal(err.message, 'proto is unrecognized');

        return true;
      });
  });

  it('should fail w/ host is NULL error', { skip: false }, async () => {
    const incorrectProtoArgs = structuredClone(connectionStringArgs);
    delete incorrectProtoArgs.host;

    assert.throws(
      () => {
        createWsConnectionString({
          proto: incorrectProtoArgs.proto,
          host: incorrectProtoArgs.host,
          port: incorrectProtoArgs.port,
          path: incorrectProtoArgs.path,
        });
      },
      (err) => {
        assert(err instanceof ReferenceError);
        assert.equal(err.message, 'host is NULL');

        return true;
      });
  });

  it('should fail w/ port is NULL error', { skip: false }, async () => {
    const incorrectProtoArgs = structuredClone(connectionStringArgs);
    delete incorrectProtoArgs.port;

    assert.throws(
      () => {
        createWsConnectionString({
          proto: incorrectProtoArgs.proto,
          host: incorrectProtoArgs.host,
          port: incorrectProtoArgs.port,
          path: incorrectProtoArgs.path,
        });
      },
      (err) => {
        assert(err instanceof ReferenceError);
        assert.equal(err.message, 'port is NULL');

        return true;
      });
  });

  it('should fail w/ port is a string error', { skip: false }, async () => {
    const incorrectProtoArgs = structuredClone(connectionStringArgs);
    incorrectProtoArgs.port = connectionStringArgs.port.toString();

    assert.throws(
      () => {
        createWsConnectionString({
          proto: incorrectProtoArgs.proto,
          host: incorrectProtoArgs.host,
          port: incorrectProtoArgs.port,
          path: incorrectProtoArgs.path,
        });
      },
      (err) => {
        assert(err instanceof TypeError);
        assert.equal(err.message, 'port is a string');

        return true;
      });
  });
});
