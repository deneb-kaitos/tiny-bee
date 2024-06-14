export class WebSocketClient {
  /**
   * @type {Map<URL, WebSocket>}
   */
  #webSockets = null;
  #protocols = Object.freeze(['']);

  constructor() {
    this.#webSockets = new Map();

    console.debug(`${this.constructor.name}.ctor`);
  }

  dispose() {
    for(const webSocket of this.#webSockets.values()) {
      webSocket?.close();
    }

    this.#webSockets.clear();
    this.#webSockets = null;

    this.#protocols = null;

    console.debug(`${this.constructor.name}.dispose`);
  }

  /**
   * 
   * @param {URL} url 
   * @returns 
   */
  getWebSocket(url = null) {
    if (url === null) {
      throw new ReferenceError('url argument is undefined');
    }

    if ((url instanceof URL) === false) {
      throw new TypeError('url argument is not an instance of URL');
    }

    if (this.#webSockets.has(URL)) {
      return this.#webSockets.get(URL);
    }

    const webSocket = new WebSocket(url, this.#protocols); 
    this.#webSockets.set(url, webSocket);

    return null;
  }
}