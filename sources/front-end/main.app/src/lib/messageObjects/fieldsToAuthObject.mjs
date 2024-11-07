import { AuthZMode } from "$lib/controls/AuthZForm/AuthZMode.svelte.js";

const expectedFieldNames = Object.freeze([
  'mode',
  'password',
  'username',
]);

export const fieldsToAuthObject = (objectType = null, operationType = null, fields = null) => {
  if (objectType === null) {
    throw new TypeError('objectType is undefined');
  }
  if (operationType === null) {
    throw new TypeError('operationType is undefined');
  }
  if (fields === null) {
    throw new TypeError('fields is undefined');
  }

  const message = Object.assign(Object.create(null), {
    type: operationType,
    meta: {
      returnTo: null,
    },
    payload: Object.create(null),
  });

  message.payload.type = objectType;

  for(const expectedFieldName of expectedFieldNames) {
    if (Object.hasOwn(fields, expectedFieldName) === false) {
      throw new TypeError(`fields.${expectedFieldName} is undefined`);
    }

    message.payload[expectedFieldName] = fields[expectedFieldName];
  }

  if (fields.mode === AuthZMode.register) {
    if (Object.hasOwn(fields, 'pin') === false) {
      throw new TypeError('.pin is undefined');
    }

    message.payload.pin = fields.pin;
  }

  return Object.freeze(message);
};