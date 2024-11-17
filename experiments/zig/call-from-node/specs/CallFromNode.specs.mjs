import os from 'node:os';
import {
  before,
  after,
  describe,
  it,
} from 'node:test';
import assert from 'node:assert/strict';
import koffi from 'koffi';

describe('Import Zig code from NodeJs', function describeImportFromNode() {
  const platform = os.platform();
  let lib = undefined;
  const getLibExt = () => {
    switch (platform) {
      case 'darwin': return 'dylib'
      case 'linux': return 'so'
      default: {
        throw new TypeError(`${platform} is not supported`);
      }
    }
  };


  before(() => {
    lib = koffi.load(`specs/libmath.${getLibExt()}`);
  });

  after(() => {
    lib?.unload();
    lib = undefined;
  });

  it('should call zig function add', { skip: false }, () => {
    const f_sum = lib?.func('int add(int a, int b)');
    const a = Math.floor(Math.random() * 10) || 1;
    const b = Math.floor(Math.random() * 10) || 1;
    const result = f_sum(a, b);

    assert(result === a + b);
  });
});