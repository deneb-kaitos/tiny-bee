import {
  AuthZModes,
} from './AuthZModes.js';

export class AuthZCtx {
  #login = $state(null);
  #password = $state(null);
  #pin = $state(null);
  #mode = $state(AuthZModes.REGISTRATION);

  get login() {
    return this.#login;
  }

  set login(value = null) {
    if (this.#login !== value) {
      this.#login = value;
    }
  }

  get password() {
    return this.#password;
  }

  set password(value = null) {
    if (this.#password !== value) {
      this.#password = value;
    }
  }

  get pin() {
    return this.#pin;
  }

  set pin(value = null) {
    if (this.#pin !== value) {
      this.#pin = value;
    }
  }

  get mode() {
    return this.#mode;
  }

  set mode(value = null) {
    if (this.#mode !== value) {
      this.#mode = value;
    }
  }
}