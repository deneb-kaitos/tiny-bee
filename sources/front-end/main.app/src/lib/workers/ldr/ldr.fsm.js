import {
  setup,
  createActor,
  assign,
  raise,
} from 'xstate';
import {
  LoaderSignalTypes,
} from './LoaderSignalTypes.js';
import {
  ProtocolMessageTypes,
} from '../ProtocolMessageTypes.js';
import {
  ApiNames,
} from './ldr.ApiNames.js';

const StateName = Object.freeze({
  INITIAL: 'INITIAL',
  CREATE_WORKERS: LoaderSignalTypes.CREATE_WORKERS,
  ERR_CREATE_WORKER: 'ERR_CREATE_WORKER',
  CHECK_ALL_WORKERS_CREATED: 'CHECK_ALL_WORKERS_CREATED',
  INIT_WORKERS: 'INIT_WORKERS',
  CHECK_ALL_WORKERS_INITIALIZED: 'CHECK_ALL_WORKERS_INITIALIZED',
  ERR_INIT_WORKER: 'ERR_INIT_WORKER',
  RUN_WORKERS: 'RUN_WORKERS',
  ERR_RUN_WORKER: 'ERR_RUN_WORKER',
  CHECK_ALL_WORKERS_RUNNING: 'CHECK_ALL_WORKERS_RUNNING',
  WORKERS_RUNNING: 'WORKERS_RUNNING',
  WORKER_DISPOSING: 'WORKER_DISPOSING',
});
const EventName = Object.freeze({
  check: 'check',
});

const buildMachine = (api = null, context) => setup(api).createMachine({
  id: 'ldr',
  context,
  initial: StateName.INITIAL,
  states: {
    [StateName.INITIAL]: {
      on: {
        [LoaderSignalTypes.CREATE_WORKERS]: {
          actions: [
            assign({
              workerInfos: ({ context }) => {
                const result = new Map();

                for(const workerName of context.workerNames) {
                  result.set(workerName, new Set());
                }

                return result;
              },
            }),
          ],
          target: StateName.CREATE_WORKERS,
        },
      },
    },
    [StateName.CREATE_WORKERS]: {
      entry: () => console.debug(`%c${StateName.CREATE_WORKERS}.entry`, 'background-color: white; color: yellowgreen;'),
      exit: () => console.debug(`%c${StateName.CREATE_WORKERS}.exit`, 'background-color: white; color: yellowgreen;'),
      invoke: {
        id: ApiNames.actors.createWorker,
        src: ApiNames.actors.createWorker,
        input: ({ context }) => {
          const result = { workerName: null };

          for (const workerName of context.workerNames) {
            /**
             * @type {Set<String>} workerInfo
             */
            const workerInfo = context.workerInfos.get(workerName);

            if(workerInfo.has(ProtocolMessageTypes.CTOR) === false) {
              result.workerName = workerName;
              
              break;
            }
          }

          return result;
        },
        onError: {
          target: StateName.ERR_CREATE_WORKER,
        },
      },
      on: {
        [ProtocolMessageTypes.CTOR]: {
          actions: [
            assign({
              workerInfos: ({ context, event }) => {
                  console.debug(`received ${ProtocolMessageTypes.CTOR}`, context, event);

                  const {
                    payload: {
                      workerName = null,
                    },
                  } = event;

                  if (workerName === null) {
                    throw new ReferenceError('workerName is undefined');
                  }

                  /**
                   * @type {Map<String, Set<String>>} workerInfos
                   */
                  const workerInfos = new Map(context.workerInfos);
                  /**
                   * @type {Set<String>}
                   */
                  const workerInfo = workerInfos.get(workerName);
                  
                  workerInfo.add(ProtocolMessageTypes.CTOR);
                  workerInfos.set(workerName, workerInfo);

                  return workerInfos;
              },
            }),
          ],
          target: StateName.CHECK_ALL_WORKERS_CREATED,
          reenter: true,
        },
      },
    },
    [StateName.ERR_CREATE_WORKER]: {
      type: 'final',
    },
    [StateName.CHECK_ALL_WORKERS_CREATED]: {
      entry: raise({
        type: EventName.check,
        data: null,
      }),
      on: {
        [EventName.check]: [
          {
            guard: ApiNames.guards.isAllWorkersCreated,
            target: StateName.INIT_WORKERS,
          },
          {
            target: StateName.CREATE_WORKERS,
          }
        ],
      }
    },
    [StateName.INIT_WORKERS]: {
      entry: () => console.debug(`%c${StateName.INIT_WORKERS}.entry`, 'background-color: white; color: yellowgreen;'),
      exit: () => console.debug(`%c${StateName.INIT_WORKERS}.exit`, 'background-color: white; color: yellowgreen;'),
      invoke: {
        id: ApiNames.actors.initWorker,
        src: ApiNames.actors.initWorker,
        input: ({ context }) => {
          const result = { workerName: null };

          for (const workerName of context.workerNames) {
            /**
             * @type {Set<String>} workerInfo
             */
            const workerInfo = context.workerInfos.get(workerName);

            if(workerInfo.has(ProtocolMessageTypes.INIT) === false) {
              result.workerName = workerName;
              
              break;
            }
          }

          return result;
        },
        onError: {
          target: StateName.ERR_INIT_WORKER,
        },
      },
      on: {
        [ProtocolMessageTypes.INIT]: {
          actions: [
            assign({
              workerInfos: ({ context, event }) => {
                  const {
                    payload: {
                      workerName = null,
                    },
                  } = event;

                  console.debug(`received ${ProtocolMessageTypes.INIT} for ${workerName}`, context, event);

                  if (workerName === null) {
                    throw new ReferenceError('workerName is undefined');
                  }

                  /**
                   * @type {Map<String, Set<String>>} workerInfos
                   */
                  const workerInfos = new Map(context.workerInfos);
                  /**
                   * @type {Set<String>}
                   */
                  const workerInfo = workerInfos.get(workerName);
                  
                  workerInfo.add(ProtocolMessageTypes.INIT);
                  workerInfos.set(workerName, workerInfo);

                  return workerInfos;
              },
            }),
          ],
          target: StateName.CHECK_ALL_WORKERS_INITIALIZED,
        },
      },
    },
    [StateName.ERR_INIT_WORKER]: {
      type: 'final',
    },
    [StateName.CHECK_ALL_WORKERS_INITIALIZED]: {
      entry: raise({
        type: EventName.check,
        data: null,
      }),
      on: {
        [EventName.check]: [
          {
            guard: ApiNames.guards.isAllWorkersInitialized,
            target: StateName.RUN_WORKERS,
          },
          {
            target: StateName.INIT_WORKERS,
          }
        ],
      }
    },
    [StateName.RUN_WORKERS]: {
      invoke: {
        id: ApiNames.actors.runWorker,
        src: ApiNames.actors.runWorker,
        input: ({ context }) => {
          const result = { workerName: null };

          for (const workerName of context.workerNames) {
            /**
             * @type {Set<String>} workerInfo
             */
            const workerInfo = context.workerInfos.get(workerName);

            if(workerInfo.has(ProtocolMessageTypes.RUN) === false) {
              result.workerName = workerName;
              
              break;
            }
          }

          return result;
        },
        onError: {
          target: StateName.ERR_RUN_WORKER,
        },
      },
      on: {
        [ProtocolMessageTypes.RUN]: {
          actions: [
            assign({
              workerInfos: ({ context, event }) => {
                  const {
                    payload: {
                      workerName = null,
                    },
                  } = event;

                  console.debug(`received ${ProtocolMessageTypes.RUN} for ${workerName}`, context, event);

                  if (workerName === null) {
                    throw new ReferenceError('workerName is undefined');
                  }

                  /**
                   * @type {Map<String, Set<String>>} workerInfos
                   */
                  const workerInfos = new Map(context.workerInfos);
                  /**
                   * @type {Set<String>}
                   */
                  const workerInfo = workerInfos.get(workerName);
                  
                  workerInfo.add(ProtocolMessageTypes.RUN);
                  workerInfos.set(workerName, workerInfo);

                  return workerInfos;
              },
            }),
          ],
          target: StateName.CHECK_ALL_WORKERS_RUNNING,
        },
      },
    },
    [StateName.ERR_RUN_WORKER]: {
      type: 'final',
    },
    [StateName.CHECK_ALL_WORKERS_RUNNING]: {
      entry: raise({
        type: EventName.check,
        data: null,
      }),
      on: {
        [EventName.check]: [
          {
            guard: ApiNames.guards.isAllWorkersRunning,
            target: StateName.WORKERS_RUNNING,
          },
          {
            target: StateName.RUN_WORKERS,
          }
        ],
      }
    },
    [StateName.WORKERS_RUNNING]: {
      entry: [
        {
          type: ApiNames.actions.loaderReady,
        }
      ],
    },
  },
});

export const LoaderFSM = (api = {}, context = {}) => createActor(buildMachine(api, context), {
  inspect: api.inspect,
});
