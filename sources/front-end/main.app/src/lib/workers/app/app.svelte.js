import {
  ProtocolMessageTypes,
} from '$lib/workers/ProtocolMessageTypes.js';
import {
  createBroadcastMessage,
} from '$lib/workers/helpers/createBroadcastMessage.js';

let connectionFactory = null;

//#region message handlers
const handle_INIT = (payload = null) => {
  console.log(`[${self.name}].handle_INIT`, payload);

  const message = createBroadcastMessage({
    type: ProtocolMessageTypes.INIT,
    meta: null,
    payload: {
      workerName: self.name,
    },
  });

  self.postMessage(message);

  console.debug(`%c${self.name}.handle_INIT`, 'background-color: white; color: yellowgreen;');
};

const handle_DISPOSE = (payload = null) => {
  connectionFactory?.dispose();
  connectionFactory = null;

  self.removeEventListener('error', handleError);
  self.removeEventListener('message', handleMessage);
  self.removeEventListener('messageerror', handleMessageError);

  const message = createBroadcastMessage({
    type: ProtocolMessageTypes.DISPOSE,
    meta: null,
    payload: {
      workerName: self.name,
    },
  });

  self.postMessage(message);

  self.close();

  console.log(`[${self.name}].handle_DISPOSE`, payload);
};

const handle_RUN = (payload = null) => {
  const message = createBroadcastMessage({
    type: ProtocolMessageTypes.RUN,
    meta: null,
    payload: {
      workerName: self.name,
    },
  });

  self.postMessage(message);

  console.log(`[${self.name}].handle_RUN`, payload);
};
//#endregion

/**
 * 
 * @param {MessageEvent} messageEvent 
 */
const handleMessage = (messageEvent) => {
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
    case ProtocolMessageTypes.RUN: {
      return handle_RUN(payload);
    }
    default: {
      throw new Error(`[${self.name}] unknown message type == ${type}`, messageEvent);
    }
  }
};

const handleError = (errorEvent) => {
  console.error(`[${self.name}.handleError]`, errorEvent);
};

const handleMessageError = (errorEvent) => {
  console.error(`[${self.name}.handleMessageError]`, errorEvent);
};

self.addEventListener('error', handleError);
self.addEventListener('message', handleMessage);
self.addEventListener('messageerror', handleMessageError);

console.debug(`%c${self.name}.ctor`, 'background-color:yellowgreen;color:white;padding:0 .5rem;');

const message = createBroadcastMessage({
  type: ProtocolMessageTypes.CTOR,
  meta: null,
  payload: {
    workerName: self.name,
  }
});

self.postMessage(message);