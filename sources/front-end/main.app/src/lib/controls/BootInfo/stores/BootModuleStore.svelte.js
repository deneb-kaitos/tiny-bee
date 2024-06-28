export class BootModuleStore {
  #ctor = $state(false);
  #init = $state(false);
  #run = $state(false);
  // eslint-disable-next-line no-unused-private-class-members
  #name = null;

  constructor(name = null) {
    if (name === null) {
      throw new ReferenceError('name is undefined');
    }

    this.#name = name;
  }

  get ctor() {
    return this.#ctor;
  }

  set ctor(value = false) {
    if (this.#ctor !== value) {
      this.#ctor = value;
    }
  }

  get init() {
    return this.#init;
  }

  set init(value = false) {
    if (this.#init !== value) {
      this.#init = value;
    }
  }

  get run() {
    return this.#run;
  }

  set run(value = false) {
    if (this.#run !== value) {
      this.#run = value;
    }
  }
}