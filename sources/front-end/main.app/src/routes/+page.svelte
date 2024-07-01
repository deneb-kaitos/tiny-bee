<script>
  import {
    BroadcastChannelName,
  } from '$lib/workers/BroadcastChannelName.js';
  import {
    LoaderSignalTypes,
  } from '$lib/workers/ldr/LoaderSignalTypes.js';
  import BootInfo from "$lib/controls/BootInfo/BootInfo.svelte";
  import AuthZ from '$lib/controls/AuthZ/AuthZ.svelte';

  /**
   * @type {BroadcastChannel | null}
   */
  let loaderBroadcastChannel;
  let isBooting = $state(true);

  /**
   * 
   * @param {MessageEvent} messageEvent
   */
  const handleLoaderMessage = (messageEvent) => {
    const {
      type,
      payload,
    } = messageEvent.data;

    console.debug('handleLoaderMessage', type, payload);

    if (type !== LoaderSignalTypes.LOADER_READY) {
      return;
    }

    isBooting = !(LoaderSignalTypes.LOADER_READY === type);
  };

  $effect(() => {
    loaderBroadcastChannel = new BroadcastChannel(BroadcastChannelName.UI);
    loaderBroadcastChannel.addEventListener('message', handleLoaderMessage);

    return () =>{
      loaderBroadcastChannel?.removeEventListener('message', handleLoaderMessage);
      loaderBroadcastChannel?.close();
    };
  });
</script>

<style>
</style>

{#if isBooting === true}
  <BootInfo />
{:else}
  <AuthZ />
{/if}
