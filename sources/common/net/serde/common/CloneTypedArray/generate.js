import { hrtime } from 'node:process';

/**
 * 
 * @param {Uint8Array} initialArray 
 * @returns 
 */
export const use_slice = (initialArray) => {
  return initialArray.slice();
};

/**
 * 
 * @param {Uint8Array} initialArray 
 * @returns 
 */
export const use_set = (initialArray) => {
  const clonedArray = new Uint8Array(initialArray.length);

  clonedArray.set(initialArray);

  return clonedArray;
};

/**
 * 
 * @param {Uint8Array} initialArray 
 * @returns 
 */
export const use_ctor = (initialArray) => {
  return new Uint8Array(initialArray);
};

/**
 * 
 * @param {Uint8Array} initialArray 
 * @returns 
 */
export const use_structuredClone = (initialArray) => {
  return structuredClone(initialArray);
};

const cloneFunctions = [use_slice, use_set, use_ctor, use_structuredClone];

const analyze_report = (report) => {
  const result = {};
  const uniq_sizes = Array.from(new Set(report.map((v) => v.size)));

  const pick_best_by_k = (items) => {
    const best_k = items.map((v) => v.k).toSorted((a, b) => a - b).toReversed()[0];
    return items.filter((v) => v.k >= best_k).map((v) => ({ size: v.size, f: v.f }));
  };

  for (const uniq_size of uniq_sizes) {
    const items_of_size = report.filter((v) => v.size === uniq_size);

    const best_item = (pick_best_by_k(items_of_size)[0]).f;

    result[uniq_size] = best_item;
  }

  return result;
}; 

export const generateCloneUInt8ArrayStatistics = ({
  sizeFrom = Number.MIN_SAFE_INTEGER,
  sizeTo = Number.MAX_SAFE_INTEGER,
  sizeIncrement = 0,
  repeat = 0,
}) => {
  if(sizeIncrement <= 0) {
    throw new TypeError('sizeIncrement should be greater than 0');
  }

  if (repeat <= 0) {
    throw new TypeError('repeat should be greater than 0');
  }

  const report = [];

  for (const f of cloneFunctions) {
    for (let s = sizeFrom; s <= sizeTo; s += sizeIncrement) {
      const a = new Uint8Array(s);
      const job_started_at = hrtime.bigint();

      for (let i = 0; i < repeat; i += 1) {
        f(a);
      } 

      const job_duration = Number(((hrtime.bigint() - job_started_at) / BigInt(repeat)));

      report.push({
        f: f.name,
        size: s,
        duration: job_duration,
        k: Number(s / job_duration),
      });
    }
  }

  return analyze_report(report);
};