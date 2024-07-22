import {
  ProtocolMessageTypes,
} from '$lib/workers/ProtocolMessageTypes.js';
import {
  BroadcastChannelName,
} from '../BroadcastChannelName.js';
import {
  SecAPI,
  SecEvents,
} from './SecAPI.js';
import {
  store as SecStore,
} from './SecStore.svelte.js';
import {
  createBroadcastMessage,
} from '$lib/workers/helpers/createBroadcastMessage.js';

/**
 * @type {BroadcastChannel}
 */
let broadcastChannel = null;

//#region API
const API = Object.freeze({
  [SecAPI.isTokenDefined]: () => {
    return SecStore.Token !== null;
  },
});
//#endregion

/**
 * 
 * @param {MessageEvent} messageEvent 
 */
const handleChannelMessage = (messageEvent) => {
  console.debug(`${self.name}.handleChannelMessage`, messageEvent);
  const {
    data: {
      type,
      payload: {
        returnTo,
      },
    },
  } = messageEvent;

  const result = (API[type])();

  if (typeof returnTo !== 'undefined' || returnTo !== null) {
    const message = createBroadcastMessage({
      type,
      meta: null,
      payload: result,
    });

    (new BroadcastChannel(returnTo)).postMessage(message);
  }
};

/**
 * 
 * @param {MessageEvent} messageEvent 
 */
const handleChannelMessageError = (messageEvent) => {
  console.error(`${self.name}.handleChannelMessageError`, messageEvent);
};

const handleTokenEvent = (messageEvent) => {
  console.debug(`${self.name}.handleTokenEvent`, messageEvent);

  const message = createBroadcastMessage({
    type: messageEvent.type,
    meta: null,
    payload: null,
  })

  broadcastChannel.postMessage(message);
};

//#region message handlers
const handle_INIT = (payload = null) => {
  console.log(`[${self.name}].handle_INIT`, payload);

  broadcastChannel = new BroadcastChannel(BroadcastChannelName.SEC);
  broadcastChannel.addEventListener('message', handleChannelMessage);
  broadcastChannel.addEventListener('messageerror', handleChannelMessageError);

  SecStore.addEventListener(SecEvents.TokenIsNull, handleTokenEvent);
  SecStore.addEventListener(SecEvents.TokenIsNotNull, handleTokenEvent)

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
  self.removeEventListener('error', handleError);
  self.removeEventListener('message', handleMessage);
  self.removeEventListener('messageerror', handleMessageError);

  SecStore.removeEventListener(SecEvents.TokenIsNull, handleTokenEvent);
  SecStore.removeEventListener(SecEvents.TokenIsNotNull, handleTokenEvent);

  broadcastChannel.removeEventListener('message', handleChannelMessage);
  broadcastChannel.removeEventListener('messageerror', handleChannelMessageError);
  broadcastChannel.close();
  broadcastChannel = null;

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
    }
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