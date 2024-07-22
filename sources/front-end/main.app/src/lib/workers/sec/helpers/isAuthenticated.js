import {
  BroadcastChannelName,
} from '$lib/workers/BroadcastChannelName.js';
import {
  SecAPI,
} from '../SecAPI.js';
import {
  createBroadcastMessage,
} from '$lib/workers/helpers/createBroadcastMessage.js';

const secChannel = new BroadcastChannel(BroadcastChannelName.SEC);

export const isAuthenticated = () => new Promise((resolve, reject) => {
  const callBackChannel = new BroadcastChannel(crypto.randomUUID());

  callBackChannel.addEventListener('message', (messageEvent) => {
    callBackChannel.close();

    const {
      data: {
        type,
        payload,
      },
    } = messageEvent;

    if (type === SecAPI.isTokenDefined) {
      resolve(payload);
    } else {
      reject(new TypeError(`unexpected type of reply: ${type}`));
    }
  }, { once: true });

  const message = createBroadcastMessage({
    type: SecAPI.isTokenDefined,
    meta: null,
    payload: {
      returnTo: callBackChannel.name,
    },
  });

  secChannel.postMessage(message);
});