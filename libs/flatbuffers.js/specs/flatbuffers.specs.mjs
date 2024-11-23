import util from 'node:util';
import {
  before,
  after,
  describe,
  it,
} from 'node:test';
import assert from 'node:assert/strict';

describe('flatbuffers.js', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const debuglog = util.debuglog('flatbuffers:specs');

  it('should import flatbuffers.js', { skip: false }, async () => {
    const flatbuffers = await import('../out/index.js') || null;

    assert(flatbuffers !== null);
  });
});
