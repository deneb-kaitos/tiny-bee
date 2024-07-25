import util from 'node:util';
import {
  getServerConfig,
} from '../helpers/getServerConfig.mjs';
import {
  LibWebsocketServer,
} from '../../LibWebsocketServer.mjs';

export async function setupCommon() {
  globalThis.debuglog = util.debug(`${LibWebsocketServer.name}:specs`);
  globalThis.serverConfig = getServerConfig(globalThis.debuglog);

  globalThis.wss = new LibWebsocketServer({
    config: globalThis.serverConfig,
    debuglog: globalThis.debuglog,
  });
}
