<script>
  import WifiIcon from './icons/wifi.svelte';
  import CpuIcon from './icons/cpu.svelte';

  let {
    /**
     * @type {String}
    */
    name = 'N/A',
    ModuleStore,
  } = $props();

  let ctor = $state(false);
  let init = $state(false);
  let run = $state(false);
  
  const nameToIcon = Object.freeze({
    comm: WifiIcon,
    app: CpuIcon,
  });

  $effect(() => {
    ctor = ModuleStore.ctor;
    init = ModuleStore.init;
    run = ModuleStore.run;

    return () => {
      ctor = false;
      init = false;
      run = false;

      console.debug(`[${name}] BootModule.svelte::dispose`);
    };
  });
</script>

<style>
  .boot-module-ctrl {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 3fr 1fr 1fr;
    grid-template-areas:
      'boot-module-icon'
      'boot-module-name'
      'boot-module-states'
    ;
    gap: var(--main-grid-gap);
    padding: calc(var(--main-padding) * 1);
    background-color: var(--theme-light_gray);
    border-radius: var(--main-border-radius);

    /* width: 100%;
    height: 100%; */

    & > .boot-module-icon {
      grid-area: boot-module-icon;
      color: var(--main-accent-color);
    }

    & > .boot-module-name {
      grid-area: boot-module-name;
      font-size: calc(var(--main-font-size) * 0.5);
    }

    & > .boot-module-states {
      grid-area: boot-module-states;
      list-style-type: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-auto-flow: column;
      gap: calc(var(--main-grid-gap) / 2);
      justify-content: space-evenly;
      align-items: center;

      container-name: boot-module-states;
      container-type: inline-size;

      & > .boot-module-state {
        aspect-ratio: 1/1;
        width: 1rem;
        border-radius: 50%;

        background-color: var(--theme-dark_gray);

        box-shadow: inset var(--box-shadow-x) var(--box-shadow-y) var(--box-shadow-blur-radius) var(--box-shadow-spread-radius) var(--theme-black);
      }

      & > :is(.ctor, .init, .run) {
        --t-behavior: allow-discrete;
        --t-delay: 0s;
        --t-duration: 1s;
        --t-timing: var(--transition-timing-function);

        background-color: var(--main-accent-color);
        /* filter: opacity(1.0); */

        transition-property: background-color;
        transition-behavior: var(--t-behavior);
        transition-delay: var(--t-delay);
        transition-duration: var(--t-duration);
        transition-timing-function: var(--t-timing);

        box-shadow: none;
      }
    }

    & > :is(.boot-module-icon, .boot-module-name) {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  /* @container (width <= 95px) {
    .boot-module-ctrl {
      grid-template-areas:
        'boot-module-icon'
        'boot-module-states'
      ;
      grid-template-rows: 3fr 1fr;
      padding: calc(var(--main-padding) / 2);
      gap: calc(var(--main-grid-gap) / 2);
      background-color: brown;

      & > .boot-module-name {
        grid-area: none;
        display: none;
      }
    }
  }

  @container boot-module-states (width <= 72px) {
    .boot-module-ctrl {
      & > .boot-module-states {
        & > .boot-module-state {
          width: 0.75rem;
        }
      }
    }
  }
  @container boot-module-states (width <= 60px) {
    .boot-module-ctrl {
      & > .boot-module-states {
        & > .boot-module-state {
          width: 0.5rem;
        }
      }
    }
  } */
</style>

<div class='boot-module-ctrl'>
  <div class='boot-module-icon'>
    <svelte:component this={nameToIcon[name]} />
  </div>
  <div class='boot-module-name'>{name}</div>
  <ul class='boot-module-states'>
    <li class='boot-module-state' class:ctor></li>
    <li class='boot-module-state' class:init></li>
    <li class='boot-module-state' class:run></li>
  </ul>
</div>