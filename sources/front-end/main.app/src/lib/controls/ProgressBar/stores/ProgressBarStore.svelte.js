export class ProgressBarStore {
  #max = $state(0);
  #value = $state(0);

  constructor(max = 0) {
    this.#max = max;
  }

  get max() {
    return this.#max;
  }

  set max(value = 0) {
    if (this.#max !== value) {
      this.#max = value;
    }
  }

  get value() {
    return this.#value;
  }

  set value(value = 0) {
    if (this.#value !== value) {
      this.#value = value;
    }
  }
}