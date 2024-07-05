<script>
  import {
    BroadcastChannelName,
  } from '$lib/workers/BroadcastChannelName.js';
  import {
    ProtocolMessageTypes,
  } from '$lib/workers/ProtocolMessageTypes.js';
	import ProgressBar from '../ProgressBar/ProgressBar.svelte';
  import {
    ProgressBarStore,
  } from '$lib/controls/ProgressBar/stores/ProgressBarStore.svelte.js';

  /**
   * @type {BroadcastChannel | null}
   */
  let loaderBroadcastChannel;
  let progressBarStore = new ProgressBarStore();

  /**
   * 
   * @param {MessageEvent} messageEvent
   */
  const handleLoaderMessage = (messageEvent) => {
    const {
      type,
      payload,
    } = messageEvent.data;

    switch(type) {
      case ProtocolMessageTypes.CTOR: {
        progressBarStore.incMax(3);

        break;
      }
      case ProtocolMessageTypes.INIT: {
        progressBarStore.incValue();

        break;
      }
      case ProtocolMessageTypes.RUN: {
        progressBarStore.incValue();

        break;
      }
      default: {
        console.debug('handleLoaderMessage', type, payload);

        break;
      }
    }
  };

  $effect(() => {
    loaderBroadcastChannel = new BroadcastChannel(BroadcastChannelName.LOADER);
    loaderBroadcastChannel.addEventListener('message', handleLoaderMessage);

    return () =>{
      loaderBroadcastChannel?.removeEventListener('message', handleLoaderMessage);
      loaderBroadcastChannel?.close();
    };
  });
</script>
<style>
  #boot-info-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100svh;

    & > #boot-info-panel {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
      grid-template-areas:
        'progress'
      ;

      width: 20svw;
      height: 5svh;

      gap: var(--main-grid-gap);
      padding: var(--main-padding);
      aspect-ratio: var(--main-aspect-ratio);
      max-width: 95svw;
      border-radius: var(--main-border-radius);

      & > #progress-container {
        grid-area: progress;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>

<article id='boot-info-container'>
  <div id='boot-info-panel'>
    <div id='progress-container'>
      <ProgressBar Store={progressBarStore} />
    </div>
  </div>
</article>