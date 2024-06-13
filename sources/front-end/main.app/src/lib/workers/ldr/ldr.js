import {
  ProtocolMessageTypes,
} from '$lib/workers/ProtocolMessageTypes.js';
import {
  LoaderSignalTypes,
} from './LoaderSignalTypes.js';
import {
  LoaderFSM,
} from './ldr.fsm.js';
import {
  ApiNames,
} from './ldr.ApiNames.js';
import {
  isAllHaveProperty,
} from '../helpers/isAllHaveProperty.js';

let loaderFSM = null;
const workerNames = Object.freeze(['comm']);
const workerProperties = new WeakMap();

/**
 * @type {Map<string, Worker} | null}
 */
const workers = new Map();
/**
 * @type {Map<string, BroadcastChannel> | null}
 */
const broadcastChannels = new Map();
const handleWorkerProtocolMessage = (e) => {
  const {
    type,
    payload,
  } = e.data;

  const properties = workerProperties.get(workers.get(payload.workerName)) || {};
  properties[type] = true;
  workerProperties.set(workers.get(payload.workerName), properties);

  loaderFSM.send({
    type,
    payload,
  });
};

const api = {
  actions: {
    // eslint-disable-next-line no-unused-vars
    [ApiNames.actions.createWorker]: ({ context, event }, { workerName }) => {
      const url = `../${workerName}/index.js`;
      const worker = new Worker(new URL(url, import.meta.url), {
        type: 'module',
        name: workerName,
      });
      workers.set(workerName, worker);
      worker.addEventListener('message', handleWorkerProtocolMessage);
    },
    // eslint-disable-next-line no-unused-vars
    [ApiNames.actions.initWorker]: ({ context, event }, { workerName }) => {
      /**
       * @type {Worker} worker
       */
      workers.get(workerName)?.postMessage({
        type: ProtocolMessageTypes.INIT,
        payload: null,
      });
    },
    // [ApiNames.actions.disposeWorker]: ({ context, event }, params) => {
    //   console.debug(ApiNames.actions.disposeWorker, context, event, params);
    // },
  },
  actors: null,
  guards: {
    [ApiNames.guards.isAllWorkersCreated]: () => {
      let result = false;

      for(const workerName of workerNames) {
       if (workers.has(workerName) === false) {
        break;
       } else {
        result = true;
       }
      }

      return result;
    },
    [ApiNames.guards.isAllWorkersInitialized]: () => isAllHaveProperty(workerNames, workers, workerProperties, ProtocolMessageTypes.INIT),
  },
  delays: null,
};
const context = {
  workerNames: workerNames.slice(),
};

//#region message handlers
const handleLoaderFSM_snapshot = (snapshot = null) => {
  console.debug('snapshot:', snapshot);
};

const handle_INIT = (payload = null) => {
  broadcastChannels.set(self.name, new BroadcastChannel(self.name));

  loaderFSM = LoaderFSM(api, context);
  loaderFSM.subscribe(handleLoaderFSM_snapshot);
  loaderFSM.start();
  loaderFSM.send({
    type: LoaderSignalTypes.CREATE_WORKERS,
  });

  console.log(`[${self.name}].handle_INIT:`, payload, workers);
};

const handle_DISPOSE = (payload = null) => {
  for(const broadcastChannel of broadcastChannels.values()) {
    broadcastChannel.close();
  }

  broadcastChannels.clear();

  for(const [workerName, worker] of workers.entries()) {
    console.debug(`disposing [${workerName}]...`);

    worker.postMessage({
      type: ProtocolMessageTypes.DISPOSE,
      payload: null,
    });
    worker.removeEventListener('message', handleWorkerProtocolMessage);
    workers.delete(workerName);
    worker.terminate();
  }

  workers.clear();

  self.close();

  console.log(`[${self.name}].handle_DISPOSE:`, payload);
};
//#endregion

/**
 * 
 * @param {MessageEvent} messageEvent 
 */
const handleError = (errorEvent) => {
  console.error(`[${self.name}.handleError]`, errorEvent);
};

/**
 * 
 * @param {MessageEvent} messageEvent 
 */
const handleMessage = (messageEvent) => {
  if (messageEvent.isTrusted === false) {
    throw (`[${self.name}] isTrusted === false; ignoring the message`, messageEvent);
  }

  const {
    type,
    payload,
  } = messageEvent.data;

  switch(type) {
    case ProtocolMessageTypes.INIT: {
      return handle_INIT(payload);
    }
    case ProtocolMessageTypes.DISPOSE: {
      return handle_DISPOSE(payload);
    }
    default: {
      throw new Error(`unexpected message type: ${type}:`, messageEvent);
    }
  }
};

/**
 * 
 * @param {MessageEvent} messageEvent 
 */
const handleMessageError = (errorEvent) => {
  console.error(`[${self.name}.handleMessageError]`, errorEvent);
};

self.addEventListener('error', handleError);
self.addEventListener('message', handleMessage);
self.addEventListener('messageerror', handleMessageError);

