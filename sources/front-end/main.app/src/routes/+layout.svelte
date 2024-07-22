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
  import BootInfo from "$lib/controls/BootInfo/BootInfo.svelte";
  import {
    goto,
  } from '$app/navigation';
  import {
    isAuthenticated,
  } from '$lib/workers/sec/helpers/isAuthenticated.js';
  import {
    SecEvents,
  } from '$lib/workers/sec/SecAPI.js';
	import { createBroadcastMessage } from '$lib/workers/helpers/createBroadcastMessage.js';

  /**
	 * @type {Worker | null}
	 */
  let ldr = $state(null);
  let isLoaderReady = $state(false);
  const secChannel = new BroadcastChannel(BroadcastChannelName.SEC);

  /**
   * 
   * @param e {BeforeUnloadEvent}
   */
  const handle_beforeunload = (e) => {
    window.removeEventListener('beforeunload', handle_beforeunload);
    secChannel.removeEventListener('message', handleSecMessage);
    secChannel.close();

    const message = createBroadcastMessage({
      type: ProtocolMessageTypes.DISPOSE,
      meta: null,
      payload: null,
    });
    ldr?.postMessage(message);

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

        // let bc = new BroadcastChannel(BroadcastChannelName.CONNECTION_FACTORY);
        // const message = createBroadcastMessage({
        //   type: 'test',
        //   meta: null,
        //   payload,
        // });
        // bc.postMessage(message);
        // bc.close();

        // bc = new BroadcastChannel(BroadcastChannelName.UI);
        // bc.postMessage({
        //   type,
        //   payload: null,
        // });
        // bc.close();

        isLoaderReady = true;

        break;
      }
    }
  };

  /**
   * 
   * @param {MessageEvent} messageEvent
   */
  const handleSecMessage = (messageEvent) => {
    console.debug('+layout.svelte::handleSecMessage', messageEvent);

    const {
      data: {
        type,
        payload,
      },
    } = messageEvent;

    switch(type) {
      case SecEvents.TokenIsNull: {
        goto('/auth', {
          replaceState: true,
        });

        break;
      } 
      case SecEvents.TokenIsNotNull: {
        // FIXME: this is NOT correct behavior
        // it should navigate to the "previous" page and restore its state
        goto('/', {
          replaceState: true,
        });

        break;
      }
      default: {
        console.debug(`ignoring "${type}" with`, payload);

        break;
      }
    }
  };

  $effect(() => {
    if (isLoaderReady === true) {
      isAuthenticated()
        .then((isAuthed = false) => {
          if (isAuthed === false) {
            goto('/auth', {
              replaceState: true,
            });
          }
        })
        .catch((authErr) => {
          console.error(authErr);
        });
    }
  });

  $effect(() => {
    window.addEventListener('beforeunload', handle_beforeunload);
    secChannel.addEventListener('message', handleSecMessage);

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
  {#if isLoaderReady === true}
    {@render children()}
  {:else}
    <BootInfo /> 
  {/if}
</ParaglideJS>