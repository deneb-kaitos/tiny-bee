<script>
  import {
    ProgressBarStore,
  } from './stores/ProgressBarStore.svelte.js';
  const {
    Store,
  } = $props();

  let max = $state(0);
  let value = $state(0);

  $effect(() => {
    max = Store.max;
    value = Store.value;
  });
</script>

<style>
  .progress-bar {
    height: 0.125rem;
    width: 100%;

    -webkit-appearance: none;
    appearance: none;
  }
  .progress-bar:not([value]) {
    visibility: hidden;
  }

  .progress-bar[value]::-webkit-progress-bar {
    background-color: var(--theme-light_gray);
  }

  .progress-bar[value]::-webkit-progress-value {
    background-color: var(--main-accent-color);
  }

  .progress-bar[value]::-webkit-progress-bar,
  .progress-bar[value]::-webkit-progress-value {
    border-radius: calc(var(--main-border-radius) / 2);
  }
</style>

<progress class='progress-bar' {value} {max} aria-label='progress'></progress>