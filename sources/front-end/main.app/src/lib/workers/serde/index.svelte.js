import {
  ProtocolMessageTypes,
} from '$lib/workers/ProtocolMessageTypes.js';
import {
  BroadcastChannelName,
} from '../BroadcastChannelName.js';
import {
  SerDeManager,
} from './SerDeManager/SerDeManager.js';
import {
  OperationType,
} from './SerDeManager/OperationType.js';

/**
 * @type {BroadcastChannel}
 */
let broadCastChannel;
let serdeManager;

/**
 * 
 * @param {MessageEvent} e 
 */
const handleBroadcastChannelMessage = (e) => {
  const {
    data: {
      type,
      meta,
      payload,
    },
  } = e;

  console.debug('handleBroadcastChannelMessage', type, meta, payload);

  switch(type) {
    case OperationType.serialize: {
      serdeManager.serialize(e.data);

      break;
    }
    case 'deserialize': {
      throw new Error('not implemented yet');
    }
    default: {
      throw new TypeError(`unexpected type: ${type}`);
    }
  }
}

const handleBroadcastChannelMessageError = (e) => {
  console.error('handleBroadcastChannelMessageError', e);
};

//#region message handlers
const handle_INIT = (payload = null) => {
  console.log(`[${self.name}].handle_INIT`, payload);

  broadCastChannel = new BroadcastChannel(BroadcastChannelName.SERDE);
  broadCastChannel.addEventListener('message', handleBroadcastChannelMessage);
  broadCastChannel.addEventListener('messageerror', handleBroadcastChannelMessageError);

  serdeManager = new SerDeManager();

  self.postMessage({
    type: ProtocolMessageTypes.INIT,
    payload: {
      workerName: self.name,
    },
  });

  console.debug(`%c${self.name}.handle_INIT`, 'background-color: white; color: yellowgreen;');
};

const handle_DISPOSE = (payload = null) => {
  broadCastChannel.removeEventListener('messageerror', handleBroadcastChannelMessageError);
  broadCastChannel.removeEventListener('message', handleBroadcastChannelMessage);
  broadCastChannel.close();
  broadCastChannel = null;

  self.removeEventListener('error', handleError);
  self.removeEventListener('message', handleMessage);
  self.removeEventListener('messageerror', handleMessageError);

  serdeManager = null;

  self.postMessage({
    type: ProtocolMessageTypes.DISPOSE,
    payload: {
      workerName: self.name,
    },
  });

  self.close();

  console.log(`[${self.name}].handle_DISPOSE`, payload);
};

const handle_RUN = (payload = null) => {
  self.postMessage({
    type: ProtocolMessageTypes.RUN,
    payload: {
      workerName: self.name,
    }
  });

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

self.postMessage({
  type: ProtocolMessageTypes.CTOR,
  payload: {
    workerName: self.name,
  }
});