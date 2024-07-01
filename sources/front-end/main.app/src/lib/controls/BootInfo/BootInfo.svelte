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
  import BootModule from "./BootModule.svelte";
  import H1 from '$lib/controls/H1/h1.svelte';

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
      grid-template-columns: 1fr 2fr 1fr;
      grid-template-rows: 1fr 3fr 0.125fr;
      grid-template-areas:
        'header header header'
        '. modules .'
        '. . .'
      ;
      gap: var(--main-grid-gap);
      padding: var(--main-padding);
      aspect-ratio: 16 / 9;
      max-width: 95svw;
      border-radius: var(--main-border-radius);

      background-color: var(--theme-black);
      filter: drop-shadow(var(--filter-drop-shadow-x) var(--filter-drop-shadow-y) var(--filter-drop-shadow-blur) var(--theme-black));

      & > #boot-caption {
        grid-area: header;
        display: flex;
        justify-content: stretch;
        align-items: stretch;

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
          /* container-type: inline-size; */
        }
      }
    }
  }
</style>

<article id='boot-info-container'>
  <div id='boot-info-panel'>
    <div id='boot-caption'>
      <H1>loading</H1>
    </div>
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