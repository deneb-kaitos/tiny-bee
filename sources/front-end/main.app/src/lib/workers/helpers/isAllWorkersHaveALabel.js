export const isAllWorkersHaveALabel = (context = null, label = null) => {
  if (context === null) {
    throw new ReferenceError('context is undefined');
  }

  if (Object.hasOwn(context, 'workerNames') === false) {
    throw new ReferenceError('context.workerNames is undefined');
  }

  if (Array.isArray(context.workerNames) === false) {
    throw TypeError('context.workerNames is not an Array<string>');
  }

  if (context.workerNames.length === 0) {
    throw new RangeError('context.workerNames is empty');
  }

  if (Object.hasOwn(context, 'workerInfos') === false) {
    throw new ReferenceError('context.workerInfos is undefined');
  }

  const {
    /**
     * @type {Array<String>} workerNames
     */
    workerNames,
    /**
     * @type {Map<String, Worker>} workerInfos
     */
    workerInfos,
  } = context;

  let result = false;

  for (const workerName of workerNames) {
    /**
     * @type {Set} workerInfo
     */
    const workerInfo = workerInfos.get(workerName);

    if (workerInfo.has(label) === false) {
      result = false;

      break;
    }

    result = true;
  }

  return result;
};
