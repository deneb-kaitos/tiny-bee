import {
  ProtocolMessageTypes,
} from '$lib/workers/ProtocolMessageTypes.js';
import {
  ConnectionFactory,
} from './ConnectionFactory.js';

let connectionFactory = null;

//#region message handlers
const handle_INIT = (payload = null) => {
  console.log(`[${self.name}].handle_INIT`, payload);

  connectionFactory = new ConnectionFactory();

  self.postMessage({
    type: ProtocolMessageTypes.INIT,
    payload: {
      workerName: self.name,
    },
  });
};

const handle_DISPOSE = (payload = null) => {
  connectionFactory?.dispose();
  connectionFactory = null;

  self.removeEventListener('error', handleError);
  self.removeEventListener('message', handleMessage);
  self.removeEventListener('messageerror', handleMessageError);

  self.postMessage({
    type: ProtocolMessageTypes.DISPOSE,
    payload: {
      workerName: self.name,
    },
  });

  self.close();

  console.log(`[${self.name}].handle_DISPOSE`, payload);
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

self.postMessage({
  type: ProtocolMessageTypes.CTOR,
  payload: {
    workerName: self.name,
  }
});