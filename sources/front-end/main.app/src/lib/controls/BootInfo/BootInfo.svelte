<script>
  import {
    BroadcastChannelName,
  } from '$lib/workers/BroadcastChannelName.js';
  import {
    ProtocolMessageTypes,
  } from '$lib/workers/ProtocolMessageTypes.js';
  import {
    BootModuleStore,
  } from './stores/BootModuleStore.svelte.js';
  import {
    ProgressBarStore,
  } from '$lib/controls/ProgressBar/stores/ProgressBarStore.svelte.js';
  import BootModule from "./BootModule.svelte";

  /**
   * @type {BroadcastChannel | null}
   */
  let loaderBroadcastChannel;

  const moduleStores = new Map();
  moduleStores.set('comm', new BootModuleStore('comm'));
  moduleStores.set('app', new BootModuleStore('app'));

  /**
   * 
   * @param {String | null} moduleName
   * @param {String | null} moduleState
   */
  const setModuleState = (moduleName = null, moduleState = null) => {
    const moduleStore = moduleStores.get(moduleName);

    switch (moduleState) {
      case ProtocolMessageTypes.CTOR: {
        moduleStore.ctor = true;

        break;
      }
      case ProtocolMessageTypes.INIT: {
        moduleStore.init = true;

        break;
      }
      case ProtocolMessageTypes.RUN: {
        moduleStore.run = true;

        break;
      }
    }
  };

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
        setModuleState(payload.workerName, type);

        break;
      }
      case ProtocolMessageTypes.INIT: {
        setModuleState(payload.workerName, type);

        break;
      }
      case ProtocolMessageTypes.RUN: {
        setModuleState(payload.workerName, type);

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
      moduleStores.clear();

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
      grid-template-columns: repeat(3, 1fr);
      /* grid-template-rows: 1fr 1fr 0.5fr; */
      grid-template-rows: repeat(2, 0.75fr) 0.25fr;
      grid-template-areas:
        'header header header'
        '. modules .'
        '. . .'
      ;
      gap: var(--main-grid-gap);
      padding: calc(var(--main-padding) * 2);
      aspect-ratio: 9/6;
      min-width: 20svw;
      border-radius: var(--main-border-radius);

      background-color: var(--theme-black);
      filter: drop-shadow(var(--filter-drop-shadow-x) var(--filter-drop-shadow-y) var(--filter-drop-shadow-blur) var(--theme-black));

      & > #boot-caption {
        grid-area: header;
        display: flex;
        justify-content: center;
        align-items: center;

        color: var(--main-accent-color);
      }

      & > #boot-modules {
        grid-area: modules;
        list-style-type: none;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        gap: var(--main-grid-gap);
        margin: 0;
        padding: 0;

        & > li {
          display: contents;
        }
      }
    }
  }
</style>

<article id='boot-info-container'>
  <div id='boot-info-panel'>
    <h1 id='boot-caption'>
      loading
    </h1>
    <ul id='boot-modules'>
      <li>
        <BootModule 
          name="comm"
          ModuleStore={moduleStores.get('comm')}
        />
      </li>
      <li>
        <BootModule
          name="app"
          ModuleStore={moduleStores.get('app')}
        />
      </li>
    </ul>
  </div>
</article>