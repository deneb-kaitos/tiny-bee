import {
  AuthZModes,
} from '$lib/controls/AuthZ/fsm/AuthZModes.js';
import {
  CredentialsFormStoreEvents as Events,
} from './CredentialsFormStoreEvents.js';

class CredentialsFormStore extends EventTarget {
  #mode = $state(AuthZModes.REGISTRATION);
  #login = $state(null);
  #password = $state(null);
  #pin = $state(null);

  #isDefined(value = null) {
    return value !== null && value !== '';
  }

  #isAllDataAvailable() {
    let result = this.#isDefined(this.Login) && this.#isDefined(this.Password);

    switch(this.#mode) {
      case AuthZModes.REGISTRATION: {
        result = result && this.#isDefined(this.Pin);

        break;
      }
      case AuthZModes.AUTHENTICATION: {
        break;
      }
    }

    this.dispatchEvent(new CustomEvent(Events.OnDataReady, {
      detail: {
        isReady: result,
      },
    }));
  }

  get Login() {
    return this.#login;
  }

  set Login(value = null) {
    if (this.#login !== value) {
      this.#login = value;

      this.#isAllDataAvailable();
    }
  }

  get Password() {
    return this.#password;
  }

  set Password(value = null) {
    if (this.#password !== value) {
      this.#password = value;

      this.#isAllDataAvailable();
    }
  }

  get Pin() {
    return this.#pin;
  }

  set Pin(value = null) {
    if (this.#pin !== value) {
      this.#pin = value;

      this.#isAllDataAvailable();
    }
  }

  get Mode() {
    return this.#mode;
  }

  set Mode(value = null) {
    if (this.#mode !== value) {
      this.#mode = value;

      this.dispatchEvent(new CustomEvent(Events.OnModeChanged, {
        detail: {
          mode: this.#mode,
        },
      }));

      this.#isAllDataAvailable();
    }
  }
}

export const store = new CredentialsFormStore();