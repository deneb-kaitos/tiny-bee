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
import { fromPromise } from 'xstate';
import { BroadcastChannelName } from '../BroadcastChannelName.js';

let loaderFSM = null;
const workerNames = Object.freeze(['comm', 'app']);
const workerProperties = new WeakMap();

/**
 * @type {Map<string, Worker} | null}
 */
const workers = new Map();
/**
 * @type {Map<string, BroadcastChannel> | null}
 */
let broadcastChannel = null;
const handleWorkerProtocolMessage = (e) => {
  const {
    type,
    payload,
  } = e.data;

  const properties = workerProperties.get(workers.get(payload.workerName)) || {};
  properties[type] = true;
  workerProperties.set(workers.get(payload.workerName), properties);

  console.debug('handleWorkerProtocolMessage', type, payload);

  loaderFSM.send({
    type,
    payload,
  });
};

const api = {
  inspect: (inspectionEvent) => {
    switch(inspectionEvent.type) {
      case '@xstate.event': {
        console.debug(
          `%cinspection: %c${inspectionEvent.event.type}`,
          'background-color:lightgray;color:black;padding:0 0.5rem;',
          'background-color:orange;color:black;padding:0 0.5rem;',
          inspectionEvent.event,
        );
        break;
      }
    }
    // console.debug('inspect:', inspectionEvent);
  },
  actions: {
     
    // [ApiNames.actions.createWorker]: ({ context, event }, { workerName }) => {
    //   console.debug(`[${ApiNames.actions.createWorker}]: ${workerName}`);

    //   const url = `../${workerName}/index.js`;
    //   const worker = new Worker(new URL(url, import.meta.url), {
    //     type: 'module',
    //     name: workerName,
    //   });
    //   workers.set(workerName, worker);
    //   worker.addEventListener('message', handleWorkerProtocolMessage);
    // },
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
    // eslint-disable-next-line no-unused-vars
    [ApiNames.actions.loaderReady]: ({ context, event}, params) => {
      self.postMessage({
        type: LoaderSignalTypes.LOADER_READY,
        payload: params, 
      })
    },
  },
  actors: {
    [ApiNames.actors.runWorker]: fromPromise(async ({ input, system }) => {
      console.debug(`.actors.${ApiNames.actors.runWorker}`, input, system);

      const {
        workerName = null,
      } = input;

      /**
       * @type {Worker} worker
       */
      for(const worker of workers.values()) {
        worker.postMessage({
          type: ProtocolMessageTypes.RUN,
          payload: null,
        })
      }

      return Promise.resolve({ workerName });
    }),
    [ApiNames.actors.initWorker]: fromPromise(async ({ input, system}) => {
      console.debug(`.actors.${ApiNames.actors.initWorker}`, input, system);

      const {
        workerName = null,
      } = input;

      console.debug(`[${ApiNames.actors.initWorker}] for ${workerName}`);

      if (workerName === null) {
        return Promise.resolve({ workerName });
      }

      workers.get(workerName)?.postMessage({
        type: ProtocolMessageTypes.INIT,
        payload: null,
      });

      return Promise.resolve({ workerName });
    }),
    [ApiNames.actors.createWorker]: fromPromise(async ({ input, system }) => {
      console.debug(`.actors.${ApiNames.actors.createWorker}`, input, system);

      const {
        workerName = null,
      } = input;

      console.debug(`[${ApiNames.actors.createWorker}] for ${workerName}`);

      if (workerName === null) {
        return Promise.resolve({ workerName });
      }

      const url = `../${workerName}/index.js`;
      const worker = new Worker(new URL(url, import.meta.url), {
        type: 'module',
        name: workerName,
      });
      workers.set(workerName, worker);
      worker.addEventListener('message', handleWorkerProtocolMessage);

      return Promise.resolve({
        workerName,
      });
    }),
    // ({ context, event }, params) => {
    //   console.debug(`[${ApiNames.actors.createWorker}]`, context, params);

    //   return false;
    // },
  },
  guards: {
    [ApiNames.guards.isAllWorkersRunning]: ({ context }) => {
      let result = false;

      for(const workerName of context.workerNames) {
        /**
         * @type {Set} workerInfo
         */
        const workerInfo = context.workerInfos.get(workerName);

        if (workerInfo.has(ProtocolMessageTypes.RUN) === false) {
          result = false;

          break;
        }
      
        result = true;
      }

      return result;
    },
    [ApiNames.guards.isAllWorkersCreated]: () => {
      let result = false;

      for(const workerName of workerNames) {
        if (workers.has(workerName) === false) {
          result = false;
          console.debug(`worker [${workerName}] isn't instantiated yet`);

          break;
        } else {
          result = true;
        }
      }

      console.debug(`[${ApiNames.guards.isAllWorkersCreated}]: ${result}`, workerNames, workers);

      return result;
    },
    [ApiNames.guards.isAllWorkersInitialized]: ({ context }) => {
      let result = false;

      for(const workerName of context.workerNames) {
        /**
         * @type {Set} workerInfo
         */
        const workerInfo = context.workerInfos.get(workerName);

        if (workerInfo.has(ProtocolMessageTypes.INIT) === false) {
          result = false;

          break;
        }
      
        result = true;
      }

      return result;
    },
  },
  delays: null,
};
const context = {
  workerNames: workerNames.slice(),
};

//#region message handlers
const handleLoaderFSM_snapshot = (snapshot = null) => {
  console.debug(
    `%c${self.name}@${snapshot.value}:`,
    'background-color:orange;color:white;padding:0 0.5rem;',
    snapshot
  );
};

const handle_INIT = (payload = null) => {
  broadcastChannel = new BroadcastChannel(BroadcastChannelName.LOADER);

  loaderFSM = LoaderFSM(api, context);
  loaderFSM.subscribe(handleLoaderFSM_snapshot);
  loaderFSM.start();
  loaderFSM.send({
    type: LoaderSignalTypes.CREATE_WORKERS,
  });

  self.postMessage({
    type: ProtocolMessageTypes.INIT,
    payload: {
      workerName: self.name,
    } 
  });

  console.log(`[${self.name}].handle_INIT:`, payload);
};

const handle_DISPOSE = (payload = null) => {
  broadcastChannel.close();
  broadcastChannel = null;

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

