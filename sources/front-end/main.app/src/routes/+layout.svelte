<script>
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';
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
  import * as m from '$lib/paraglide/messages.js';

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
        // this is reached; it means all the Workers are currently running; all good; the [app] worker should take care of the next steps
        console.debug('handleLoaderMessage', type);

        let bc = new BroadcastChannel(BroadcastChannelName.CONNECTION_FACTORY);
        bc.postMessage({
          type: 'test',
          payload,
        });
        bc.close();

        bc = new BroadcastChannel(BroadcastChannelName.UI);
        bc.postMessage({
          type,
          payload: null,
        });
        bc.close();

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
  <title>
    {m.mainTitle()}
  </title>
</svelte:head>

<ParaglideJS {i18n}>
  {@render children()}
</ParaglideJS>