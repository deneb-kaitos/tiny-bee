/**
 * 
 * @param {Array<string>} names - an array of names
 * @param {Map<string, Worker>} objects - a Map of objects
 * @param {WeakMap<object, object>} properties - a WeakMap of object's properties
 * @param {String} property - a property being checked
 * @returns {Boolean}
 */
export const isAllHaveProperty = (names = null, objects = null, properties = null, property = null) => {
  let result = false;

  for(const name of names) {
    const p = properties.get(objects.get(name));

    if(Object.hasOwn(p, property) === false) {
      break;
    }

    result = true;
  }

  return result;
};
