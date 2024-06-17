/**
 * 
 * @param {Array<string>} names - an array of names
 * @param {Map<string, Worker>} objects - a Map of objects
 * @param {WeakMap<object, object>} properties - a WeakMap of object's properties
 * @param {String} property - a property being checked
 * @returns {Boolean}
 */
export const isAllHaveProperty = (names = null, objects = null, properties = null, property = null) => {
  if (names === null) {
    throw new ReferenceError('isAllHaveProperty.names === null');
  }

  if (objects === null) {
    throw new ReferenceError('isAllHaveProperty.objects === null');
  } 

  if (properties === null) {
    throw new ReferenceError('isAllHaveProperty.properties === null');
  } 

  if (property === null) {
    throw new ReferenceError('isAllHaveProperty.property === null');
  } 

  let result = false;

  for(const name of names) {
    const o = objects.get(name) || null;

    if (o === null) {
      break;
    }

    const p = properties.get(o) || null;
    
    if (p === null) {
      break;
    }

    if(Object.hasOwn(p, property) === false) {
      break;
    }

    result = true;
  }

  return result;
};
