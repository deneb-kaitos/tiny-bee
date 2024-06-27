<script>
  import WifiIcon from './icons/wifi.svelte';
  import CpuIcon from './icons/cpu.svelte';

  const {
    /**
     * @type {String} name
    */
    name = 'N/A',
    /**
     * @type {Boolean} ctor
    */
    ctor = false,
    /**
     * @type {Boolean} init
    */
    init = false,
    /**
     * @type {Boolean} run
    */
    run = false,
  } = $props();

  const nameToIcon = Object.freeze({
    comm: WifiIcon,
    app: CpuIcon,
  });
</script>

<style>
  .boot-module-ctrl {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto auto;
    grid-template-areas:
      'boot-module-icon'
      'boot-module-name'
      'boot-module-states'
    ;
    gap: var(--main-grid-gap);
    padding: var(--main-padding);
    background-color: var(--theme-light_gray);
    border-radius: var(--main-border-radius);

    & > .boot-module-icon {
      grid-area: boot-module-icon;
    }

    & > .boot-module-name {
      grid-area: boot-module-name;
      font-size: calc(var(--main-font-size) * 0.85);
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

      & > .boot-module-state {
        aspect-ratio: 1/1;
        width: 1rem;
        border-radius: 50%;
        filter: opacity(0.5);

        background-color: var(--theme-dark_gray);
      }

      & > :is(.ctor, .init, .run) {
        background-color: var(--theme-blue);
        filter: opacity(1.0);
      }
    }

    & > :is(.boot-module-icon, .boot-module-name) {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
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