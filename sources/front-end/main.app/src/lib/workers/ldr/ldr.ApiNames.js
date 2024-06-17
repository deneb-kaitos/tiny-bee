export const ApiNames = Object.freeze({
  actions: {
    createWorker: 'createWorker',
    initWorker: 'initWorker',
    disposeWorker: 'disposeWorker',
    loaderReady: 'loaderReady',
  },
  actors: {
    createWorker: 'createWorker',
    initWorker: 'initWorker',
    runWorker: 'runWorker',
  },
  guards: {
    isAllWorkersCreated: 'isAllWorkersCreated',
    // isNotAllWorkersCreated: 'isNotAllWorkersCreated',
    isAllWorkersInitialized: 'isAllWorkersInitialized',
    isAllWorkersRunning: 'isAllWorkersRunning',
  },
});