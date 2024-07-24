import {
  BroadcastChannelName,
} from '../BroadcastChannelName.js';
import {
  WebSocketClient,
} from './WebSocketClient.js';

export class ConnectionFactory {
  #name = null;
  /**
   * @type {BroadcastChannel}
   */
  #broadcastChannel = null;

  /**
   * 
   * @param {MessageEvent} e 
   */
  #handleBroadcastChannelMessage = (e) => {
    const {
      type,
      payload,
    } = e.data;

    console.debug(`${this.#name}.#handleBroadcastChannelMessage`, type, payload);
  }

  /**
   * 
   * @param {MessageEvent} e 
   */
  #handleBroadcastChannelMessageError = (e) => {
    console.debug(`${this.#name}.#handleBroadcastChannelMessageError`, e);
  }

  constructor(name = null) {
    this.#name = `${name}::ConnectionFactory`;
    this.#handleBroadcastChannelMessage = this.#handleBroadcastChannelMessage.bind(this);
    this.#handleBroadcastChannelMessageError = this.#handleBroadcastChannelMessageError.bind(this);

    this.#broadcastChannel = new BroadcastChannel(BroadcastChannelName.CONNECTION_FACTORY);
    this.#broadcastChannel.addEventListener('message', this.#handleBroadcastChannelMessage);
    this.#broadcastChannel.addEventListener('messageerror', this.#handleBroadcastChannelMessageError);

    console.debug(`${this.#name}.ctor`);
  }

  dispose() {
    this.#handleBroadcastChannelMessage = null;
    this.#handleBroadcastChannelMessageError = null;

    this.#broadcastChannel?.removeEventListener('message', this.#handleBroadcastChannelMessage);
    this.#broadcastChannel?.removeEventListener('messageerror', this.#handleBroadcastChannelMessageError);
    this.#broadcastChannel?.close();
    this.#broadcastChannel = null;

    console.debug(`${this.#name}.dispose`);
  }
}