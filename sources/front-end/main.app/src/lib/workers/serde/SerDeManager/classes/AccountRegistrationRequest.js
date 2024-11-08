export class AccountRegistrationRequest {
  username = null;
  password = null;
  pin = null;
  type = Object.freeze(this.constructor.name);

  /**
   * 
   * @param {string | null} username 
   * @param {string | null} password 
   * @param {string | null} pin 
   */
  constructor(username = null, password = null, pin = null) {
    if (username === null || username.length === 0) {
      throw new ReferenceError('username is undefined or empty');
    }
    if (password === null || password.length === 0) {
      throw new ReferenceError('password is undefined or empty');
    }
    if (pin === null || pin.length === 0) {
      throw new ReferenceError('pin is undefined or empty');
    }

    this.password = password;
    this.pin = pin;
    this.username = username;
  }
}