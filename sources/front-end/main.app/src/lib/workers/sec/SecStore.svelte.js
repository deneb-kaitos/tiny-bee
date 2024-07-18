import {
  SecEvents,
} from './SecAPI.js';

class SecStore extends EventTarget {
  #token = $state(null);

  #notifyTokenIsNull() {
    if (this.#token === null) {
      this.dispatchEvent(new CustomEvent(SecEvents.TokenIsNull));
    } else {
      this.dispatchEvent(new CustomEvent(SecEvents.TokenIsNotNull));
    }
  }

  constructor() {
    super();

    this.#notifyTokenIsNull();
  }

  get Token() {
    return this.#token;
  }

  set Token(value = null) {
    if (this.#token !== value) {
      this.#token = value;

      this.#notifyTokenIsNull();
    }
  }
}

export const store = new SecStore();