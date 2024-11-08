export class AccountAuthenticationRequest {
  username = null;
  password = null;
  type = Object.freeze(this.constructor.name);

  /**
   * 
   * @param {string | null} username 
   * @param {string | null} password 
   */
  constructor(username = null, password = null) {
    if (username === null || username.length === 0) {
      throw new ReferenceError('username is undefined or empty');
    }
    if (password === null || password.length === 0) {
      throw new ReferenceError('password is undefined or empty');
    }

    this.password = password;
    this.username = username;
  }
}