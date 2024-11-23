import util from 'node:util';
import {
  before,
  after,
  describe,
  it,
} from 'node:test';
import assert from 'node:assert/strict';
import flatbuffers from '../out/index.js';

describe('flatbuffers.js', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const debuglog = util.debuglog('flatbuffers:specs');

  it('should import flatbuffers.js', { skip: false }, async () => {
    const flatbuffers = await import('flatbuffers') || null;

    assert(flatbuffers !== null);
  });
});
