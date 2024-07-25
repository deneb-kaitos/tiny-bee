export async function tearDownCommon() {
  globalThis.wss = null;
  globalThis.debuglog = null;

  delete globalThis.wss;
  delete globalThis.debuglog;
}
