<script>
	import 'inter-ui/inter-variable.css';
  import {
    ProtocolMessageTypes,
  } from '$lib/workers/ProtocolMessageTypes.js';
  import {
    LoaderSignalTypes,
  } from '../lib/workers/ldr/LoaderSignalTypes.js';
  import {
    BroadcastChannelName,
  } from '../lib/workers/BroadcastChannelName.js';

  /**
	 * @type {Worker | null}
	 */
  let ldr = $state(null);

  /**
   * 
   * @param e {BeforeUnloadEvent}
   */
  const handle_beforeunload = (e) => {
    window.removeEventListener('beforeunload', handle_beforeunload);

    ldr?.postMessage({
      type: ProtocolMessageTypes.DISPOSE,
      payload: null,
    });

    ldr?.removeEventListener('message', handleLoaderMessage);

    ldr?.terminate();
  }
  /**
   * 
   * @param e {MessageEvent}
   */
  const handleLoaderMessage = (e) => {
    const {
      type,
      payload,
    } = e?.data;

    switch(type) {
      case LoaderSignalTypes.LOADER_READY: {
        console.debug('handleLoaderMessage', type);

        let bc = new BroadcastChannel(BroadcastChannelName.CONNECTION_FACTORY);
        bc.postMessage({
          type: 'test',
          payload,
        });
        bc.close();

        break;
      }
      default: {
        console.debug(`ignoring message type: ${type}`);

        break;
      }
    }
  };

  $effect(() => {
    window.addEventListener('beforeunload', handle_beforeunload);

    if (ldr === null) {
      ldr = new Worker(new URL('$lib/workers/ldr/ldr.js', import.meta.url), {
        type: 'module',
        name: 'ldr',
      });

      ldr.addEventListener('message', handleLoaderMessage);

      ldr.postMessage({
        type: ProtocolMessageTypes.INIT,
        payload: null,
      });
    }

  });

  const { children } = $props();

</script>

<svelte:head>
  <title>tiny bee</title>
</svelte:head>

{@render children()}