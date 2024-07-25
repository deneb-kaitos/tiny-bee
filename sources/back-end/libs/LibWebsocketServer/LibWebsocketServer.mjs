import {
  EventEmitter,
} from 'node:events';
import uWS from 'uWebSockets.js';
import {
  nanoid,
} from 'nanoid';
import {
  readJson,
} from './readJson.js';
import {
  LibWebsocketServerEvents,
} from './LibWebsocketServerEvents.mjs';
// import {
//   Topics,
// } from './Topics.js';

const SHOULD_MESSAGE_BE_BINARY = true;
const SHOULD_MESSAGE_BE_COMPRESSED = true;

export class LibWebsocketServer {
  #config = null;
   
  /* c8 ignore next */
  #debuglog = () => { };
  #handle = null;
  /** @type {uWS.TemplatedApp} */
  #server = null;
  // #encoder = new TextEncoder();
  // #decoder = new TextDecoder();
  #tsInterval = null;
  #moneyInterval = null;
  /**
   * @type {Map<string, object>} #clients
   */
  #clients = null;

  #events = null;

  /* c8 ignore start */
  constructor({ config = null, debuglog = () => {} }) {
    if (config === null) {
      throw new ReferenceError('config is undefined');
    }

    this.#debuglog = debuglog;
    // this.#debuglog = util.debuglog(this.constructor.name);
    this.#config = Object.freeze({ ...config });
    this.#events = new EventEmitter();
  }
  /* c8 ignore end */

  get IS_RUNNING() {
    return this.#handle !== null;
  }

  get Events() {
    return this.#events;
  }

  get Clients() {
    return this.#clients;
  }

  /* c8 ignore start */
  sendMessageToClient(clientId = null, message = null) {
    if (clientId === null) {
      throw new ReferenceError('clientId is undefined');
    }

    if (message === null) {
      throw new ReferenceError('message is undefined');
    }

    try {
      const client = this.#clients.get(clientId);

      client.send(message, SHOULD_MESSAGE_BE_BINARY, SHOULD_MESSAGE_BE_COMPRESSED);
    } catch (error) {
      this.#debuglog(error);
    }
  }
  /* c8 ignore end */

  start() {
    return new Promise((ok, fail) => {
      if (this.#handle !== null) {
        this.#debuglog(`${this.constructor.name} has already been started on ${this.#config.server.host}:${this.#config.server.port}`);
         
        return fail();
      }

      this.#clients = new Map();

      this.#server = uWS
        .App({})
        .post('/csp-violation-report', (res) => {
          readJson(res, (o) => {
            this.#debuglog('/csp-violation-report', o);

            res.end();
          }, (readError) => {
            this.#debuglog(readError);
          });
        })
        .ws('/*', {
          compression: uWS.DEDICATED_COMPRESSOR_3KB,
          maxPayloadLength: 16 * 1024 * 1024,
          maxBackpressure: 1024,
          idleTimeout: 16,
          upgrade: (res, req, context) => {
            const upgradeAborted = {
              isAborted: false,
            };

            res.onAborted(() => {
              upgradeAborted.isAborted = true;
            });

            const url = req.getUrl();
            const secWebSocketKey = req.getHeader('sec-websocket-key');
            const secWebSocketProtocol = req.getHeader('sec-websocket-protocol');
            const secWebSocketExtensions = req.getHeader('sec-websocket-extensions');

            if (upgradeAborted.isAborted === false) {
              res
                .writeStatus('101 Switching Protocols')
                .writeHeader('Set-Cookie', `userId=${nanoid()}`)
                .upgrade(
                  {
                    url,
                  },
                  secWebSocketKey,
                  secWebSocketProtocol,
                  secWebSocketExtensions,
                  context,
                );
            }
          },
           
          open: (ws) => {
            ws.id = nanoid();
            this.#clients.set(ws.id, ws);

            this.#events.emit(LibWebsocketServerEvents.CLIENT_CONNECTED, {
              clientId: ws.id,
            });

            // ws.subscribe(Topics.SERVER.TS);
            // ws.subscribe(Topics.SERVER.MONEY);
          },
          message: (ws = null, message = null, isBinary = false) => {
            this.#events.emit(LibWebsocketServerEvents.MESSAGE_EVENT, {
              ws,
              message,
              isBinary,
            });
          },
           
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          close: (ws, code, message) => {
            this.#clients.delete(ws.id);

            this.#events.emit(LibWebsocketServerEvents.CLIENT_DISCONNECTED, {
              clientId: ws.id,
            });
          },
        })
        .any('/*', (res) => {
          res.end('nothing is here');
        })
        .listen(this.#config.server.host, this.#config.server.port, (handle = null) => {
          if (handle === null) {
            fail(new Error(`${this.constructor.name} has failed to listen to ${this.#config.server.host}:${this.#config.server.port}`));
          }

          this.#handle = handle;
          this.#debuglog(`${this.constructor.name} is listening on ${this.#config.server.host}:${this.#config.server.port}`);

          ok();
        });

       
      return undefined;
    });
  }

  publish(message, messageType) {
    if (this.#handle === null) {
      throw new ReferenceError('server is not started');
    }

    this.#server.publish(
      messageType,
      message,
      SHOULD_MESSAGE_BE_BINARY,
      SHOULD_MESSAGE_BE_COMPRESSED,
    );
  }

  stop() {
    if (this.#handle) {
      clearInterval(this.#tsInterval);
      clearInterval(this.#moneyInterval);

      uWS.us_listen_socket_close(this.#handle);

      this.#handle = null;
      this.#clients = null;
    }

    this.#debuglog(`${this.constructor.name} has stopped listening on ${this.#config.server.host}:${this.#config.server.port}`);
  }
}
