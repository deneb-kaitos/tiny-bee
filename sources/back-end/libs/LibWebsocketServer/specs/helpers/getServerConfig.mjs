import {
  Proto,
} from '../../Proto.mjs';

const expectedProtos = Object.freeze(Object.values(Proto));

export const getServerConfig = () => {
  const host = process.env.WS_HOST || null;
  const port = process.env.WS_PORT || null;
  const proto = process.env.WS_PROTO || null;

  if (host === null) {
    throw new ReferenceError('host is undefined');
  }

  if (port === null) {
    throw new ReferenceError('port is undefined');
  }

  if (proto === null) {
    throw new ReferenceError('proto is undefined');
  }

  if (expectedProtos.includes(proto) === false) {
    throw new RangeError(`proto is not one of [${expectedProtos.join(', ')}]`);
  }

  return Object.freeze({
    server: {
      host,
      port: parseInt(port, 10),
      proto,
    },
  });
};
