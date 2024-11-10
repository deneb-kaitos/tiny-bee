import util from 'node:util';
import {
  describe,
  it,
} from 'node:test';
import assert from 'node:assert';
import { env } from 'node:process';
import {
  generateCloneUInt8ArrayStatistics,
} from '../generate.js';

describe('clone UInt8Array', () => {
  const JUMBO_ETHERNET_FRAME_SIZE = parseInt(env.JUMBO_ETHERNET_FRAME_SIZE);
  const REPEAT = parseInt(env.REPEAT);
  const SIZE_INC = parseInt(env.SIZE_INC);

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
});
