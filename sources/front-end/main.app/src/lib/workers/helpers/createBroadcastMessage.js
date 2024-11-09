export const createBroadcastMessage = ({ type = null, meta = null, payload = null }) => {
  if (type === null) {
    throw new ReferenceError('type is undefined');
  }

  return Object.freeze({
    type: Object.freeze(type),
    meta: meta === null ? {} : Object.freeze(meta),
    payload: payload ?? {},
  });
};