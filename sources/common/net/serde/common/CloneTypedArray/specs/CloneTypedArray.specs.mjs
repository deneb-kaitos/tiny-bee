import {
  before,
  after,
  describe,
  it,
} from 'node:test';
import assert from 'node:assert';
import { env } from 'node:process';
import {
  generateCloneUInt8ArrayStatistics,
  use_ctor,
  use_set,
  use_slice,
  use_structuredClone,
} from '../generate.js';

describe('clone UInt8Array', () => {
  const JUMBO_ETHERNET_FRAME_SIZE = parseInt(env.JUMBO_ETHERNET_FRAME_SIZE);
  const REPEAT = parseInt(env.REPEAT);
  const SIZE_INC = parseInt(env.SIZE_INC);

  let uint8Array = null;

  before(() => {
    uint8Array = new Uint8Array(JUMBO_ETHERNET_FRAME_SIZE);
    crypto.getRandomValues(uint8Array);
  });

  after(() => {
    uint8Array = undefined;
  });

  // TODO: generate a class w/ resolve cloning function by the size of the buffer given
  it('should measure cloning UInt8Array of various sizes', { skip: false}, async () => {
    const report = generateCloneUInt8ArrayStatistics({
      sizeFrom: 100,
      sizeTo: JUMBO_ETHERNET_FRAME_SIZE,
      sizeIncrement: SIZE_INC,
      repeat: REPEAT,
    });

    assert.ok(report !== null);
  });

  it('should use_ctor to clone a UInt8Array', { skip: false }, async () => {
    const clonedArray = use_ctor(uint8Array);

    assert.deepStrictEqual(clonedArray, uint8Array);
  });

  it('should use_set to clone a UInt8Array', { skip: false }, async () => {
    const clonedArray = use_set(uint8Array);

    assert.deepStrictEqual(clonedArray, uint8Array);
  });

  it('should use_slice to clone a UInt8Array', { skip: false }, async () => {
    const clonedArray = use_slice(uint8Array);

    assert.deepStrictEqual(clonedArray, uint8Array);
  });

  it('should use_structuredClone to clone a UInt8Array', { skip: false }, async () => {
    const clonedArray = use_structuredClone(uint8Array);

    assert.deepStrictEqual(clonedArray, uint8Array);
  });
});
