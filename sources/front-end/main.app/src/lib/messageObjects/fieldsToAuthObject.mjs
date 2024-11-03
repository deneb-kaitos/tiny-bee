import { AuthZMode } from "$lib/controls/AuthZForm/AuthZMode.svelte.js";

const expectedFieldNames = Object.freeze([
  'mode',
  'password',
  'username',
]);

const field = (value = null) => {
  return {
    value,
    writable: false,
    enumerable: true,
    configurable: false,
  };
};

export const fieldsToAuthObject = (fields = null) => {
  if (fields === null) {
    throw new TypeError('fields undefined');
  }

  const result = Object.create(null);

  for(const expectedFieldName of expectedFieldNames) {
    if (Object.hasOwn(fields, expectedFieldName) === false) {
      throw new TypeError(`fields.${expectedFieldName} is undefined`);
    }

    result[expectedFieldName] = field(fields[expectedFieldName]);
  }

  if (fields.mode === AuthZMode.register) {
    if (Object.hasOwn(fields, 'pin') === false) {
      throw new TypeError('.pin is undefined');
    }

    result.pin = field(fields.pin);
  }

  return Object.create(null, result);
};