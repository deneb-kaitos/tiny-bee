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
  isAllWorkersHaveALabel,
} from '../helpers/isAllWorkersHaveALabel.js';
import { fromPromise } from 'xstate';
import { BroadcastChannelName } from '../BroadcastChannelName.js';
import {
  createBroadcastMessage,
} from '$lib/workers/helpers/createBroadcastMessage.js';

let loaderFSM = null;
const workerNames = Object.freeze(['sec', 'serde', 'comm', 'app']);
const workerProperties = new WeakMap();

/**
 * @type {Map<string, Worker} | null}
 */
const workers = new Map();
/**
 * @type {BroadcastChannel | null}
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

  const loaderMessage = createBroadcastMessage({
    type,
    meta: null,
    payload,
  });
  loaderFSM.send(loaderMessage);

  const message = createBroadcastMessage({
    type,
    meta: null,
    payload,
  })

  broadcastChannel?.postMessage(message);
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
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    [ApiNames.actions.initWorker]: ({ context, event }, { workerName }) => {
      const message = createBroadcastMessage({
        type: ProtocolMessageTypes.INIT,
        meta: null,
        payload: null,
      })
      /**
       * @type {Worker} worker
       */
      workers.get(workerName)?.postMessage(message);
    },
    // eslint-disable-next-line no-unused-vars
    [ApiNames.actions.loaderReady]: ({ context, event}, params) => {
      const message = createBroadcastMessage({
        type: LoaderSignalTypes.LOADER_READY,
        meta: null,
        payload: params || null, 
      });
      self.postMessage(message);
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
        const message = createBroadcastMessage({
          type: ProtocolMessageTypes.RUN,
          meta: null,
          payload: null,
        });
        worker.postMessage(message);
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

      const message = createBroadcastMessage({
        type: ProtocolMessageTypes.INIT,
        meta: null,
        payload: null,
      });

      workers.get(workerName)?.postMessage(message);

      return Promise.resolve({ workerName });
    }),
    [ApiNames.actors.createWorker]: fromPromise(({ input, system }) => {
      const {
        workerName = null,
      } = input;

      console.debug(`.actors.${ApiNames.actors.createWorker}`, input, system, workerName);


      if (workerName === null) {
        return Promise.reject({ workerName });
      }

      let worker = null;

      try {
        switch(workerName) {
          case 'sec': {
            worker = new Worker(new URL('../sec/sec.svelte.js', import.meta.url), {
              type: 'module',
              name: 'sec',
            });

            break;
          }
          case 'serde': {
            worker = new Worker(new URL('../serde/serde.svelte.js', import.meta.url), {
              type: 'module',
              name: 'serde',
            });

            break;
          }
          case 'comm': {
            worker = new Worker(new URL('../comm/comm.svelte.js', import.meta.url), {
              type: 'module',
              name: 'comm',
            });

            break;
          }
          case 'app': {
            worker = new Worker(new URL('../app/app.svelte.js', import.meta.url), {
              type: 'module',
              name: 'app',
            });

            break;
          }
          default: {
            throw new Error(`module "${workerName}" is unknown`);
          }
        }
        workers.set(workerName, worker);
        worker.addEventListener('message', handleWorkerProtocolMessage);

        return Promise.resolve({
          workerName,
        });
      } catch(error) {
        console.error(error);
        
        return Promise.reject(error);
      }
    }),
  },
  guards: {
    [ApiNames.guards.isAllWorkersRunning]: ({ context }) => isAllWorkersHaveALabel(context, ProtocolMessageTypes.RUN),
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
    [ApiNames.guards.isAllWorkersInitialized]: ({ context }) => isAllWorkersHaveALabel(context, ProtocolMessageTypes.INIT),
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

  const message = createBroadcastMessage({
    type: ProtocolMessageTypes.INIT,
    meta: null,
    payload: {
      workerName: self.name,
    },
  });

  self.postMessage(message);

  console.log(`[${self.name}].handle_INIT:`, payload);
};

const handle_DISPOSE = (payload = null) => {
  broadcastChannel.close();
  broadcastChannel = null;

  for(const [workerName, worker] of workers.entries()) {
    console.debug(`disposing [${workerName}]...`);

    const message = createBroadcastMessage({
      type: ProtocolMessageTypes.DISPOSE,
      meta: null,
      payload: null,
    });
    worker.postMessage(message);
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
