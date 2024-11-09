export const createBroadcastMessage = ({ type = null, meta = null, payload = null }) => {
  if (type === null) {
    throw new ReferenceError('type is undefined');
  }

  // const p = (payload instanceof Uint8Array) ? structuredClone(payload, { transfer: [payload.buffer] }) : null;
  const p = (payload instanceof Uint8Array) ? structuredClone(payload, { }) : null;

  const result = {
    type: Object.freeze(type),
    meta: meta === null ? {} : Object.freeze(meta),
    payload: p === null ? payload ?? {} : p,
  };

  return result;
};