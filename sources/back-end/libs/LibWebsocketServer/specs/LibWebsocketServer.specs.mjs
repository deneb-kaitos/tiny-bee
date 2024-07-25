import {
  EventEmitter,
} from 'node:events';
import {
  before,
  after,
  describe,
  it,
} from 'node:test';
import assert from 'node:assert/strict';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import WebSocket from 'ws';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  nanoid,
} from 'nanoid';
import {
  setupCommon,
} from './common/setup.mjs';
import {
  tearDownCommon,
} from './common/teardown.mjs';
import {
  LibWebsocketServer,
} from '../LibWebsocketServer.mjs';
import {
  getServerConfig,
} from './helpers/getServerConfig.mjs';

describe('LibWebsocketServer', function describeLibWebsocketServer() {
  before(async function doBefore() {
    await setupCommon();
  });

  after(async function doAfter() {
    await tearDownCommon();
  });

  it('construct LibWebsocketServer', { skip: false }, async () => {
    const config = getServerConfig(); 
    const server = new LibWebsocketServer({
      config,
      debuglog: console.log,
    });

    assert.equal(server.IS_RUNNING, false);
  });

  it('should fail on undefined config', { skip: false}, async () => {
    assert.throws(
      () => {
        new LibWebsocketServer({ config: null, debuglog: () => {}});
      },
      (err) => {
        assert(err instanceof ReferenceError);
        assert.equal(err.message, 'config is undefined');

        return true;
      }
    );
  });

  it('server.Events must be of the EventEmitter type', { skip: false }, async () => {
    assert(globalThis.wss.Events instanceof EventEmitter);
  });

  it('server.Clients must be NULL when server is not running', { skip: false }, async () => {
    assert(globalThis.wss.IS_RUNNING === false);
    assert(globalThis.wss.Clients === null);
  });
});
