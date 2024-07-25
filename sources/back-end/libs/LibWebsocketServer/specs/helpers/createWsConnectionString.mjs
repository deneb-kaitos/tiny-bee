import {
  Proto,
} from '../../Proto.mjs';

const expectedProtos = Object.freeze(Object.values(Proto));

export const createWsConnectionString = ({ proto = null, host = null, port = null, path = null }) => {
  if (proto === null) {
    throw new ReferenceError('proto is NULL');
  }

  if (expectedProtos.includes(proto) === false) {
    throw new RangeError('proto is unrecognized');
  }

  if (host === null) {
    throw new ReferenceError('host is NULL');
  }

  if (port === null) {
    throw new ReferenceError('port is NULL');
  }

  if (typeof port === 'string' ) {
    throw new TypeError('port is a string');
  }

  return `${proto}://${host}:${port}${path}`;
};
