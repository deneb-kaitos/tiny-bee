import {
  setup,
  createActor,
  assign,
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
  INIT_WORKERS: 'INIT_WORKERS',
  WORKERS_RUNNING: 'WORKERS_RUNNING',
  WORKER_DISPOSING: 'WORKER_DISPOSING',
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
              workerToCreatePtr:  0,
            }),
          ],
          target: LoaderSignalTypes.CREATE_WORKERS,
        },
      },
    },
    [LoaderSignalTypes.CREATE_WORKERS]: {
      entry: [
        { type: ApiNames.actions.createWorker, params: ({ context }) => ({ workerName: context.workerNames[context.workerToCreatePtr] }) },
      ],
      on: {
        [ProtocolMessageTypes.CTOR]: {
          actions: [
            assign({
              workerToCreatePtr: ({ context }) => context.workerToCreatePtr >= (context.workerNames.length - 1) ? null : context.workerToCreatePtr += 1,
            }),
          ],
          guard: ApiNames.guards.isAllWorkersCreated,
          target: StateName.INIT_WORKERS,
        },
      },
      exit: [
        assign({
          workerToInitPtr: 0,
        }),
      ],
    },
    [StateName.INIT_WORKERS]: {
      entry: [
        { type: ApiNames.actions.initWorker, params: ({ context }) => ({ workerName: context.workerNames[context.workerToInitPtr] })},
      ],
      on: {
        [ProtocolMessageTypes.INIT]: {
          actions: [
            assign({
              workerToInitPtr: ({ context }) => context.workerToInitPtr >= (context.workerNames.length - 1) ? null : context.workerToInitPrt += 1,
            }),
          ],
          guard: ApiNames.guards.isAllWorkersInitialized,
          target: StateName.WORKERS_RUNNING,
        },
      },
    },
    [StateName.WORKERS_RUNNING]: {
      entry: [
        { type: ApiNames.actions.loaderReady, params: null },
      ],
    },
  },
});

export const LoaderFSM = (api = {}, context = {}) => createActor(buildMachine(api, context));
