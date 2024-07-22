export const createBroadcastMessage = ({ type = null, meta, payload }) => {
  if (type === null) {
    throw new ReferenceError('type is undefined');
  }
  
  if (typeof meta === typeof undefined) {
    throw new ReferenceError('meta is undefined');
  }

  if (typeof payload === typeof undefined) {
    throw new ReferenceError('payload is undefined');
  }

  return Object.freeze({
    type,
    meta,
    payload,
  });
};