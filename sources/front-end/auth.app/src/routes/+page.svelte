<script>
  import MainVisual from '$lib/controls/MainVisual/MainVisual.svelte';
  import ViseSelector from '$lib/controls/ViseSelector/ViseSelector.svelte';
</script>

<style>
  .main-article {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: 1fr;
    grid-template-areas:
      'main-visuals'
      'vise-selector'
    ;

    & .main-visuals-container {
      grid-area: main-visuals;
    }

    & .vise-selector-container {
      grid-area: vise-selector;
    }
  }
</style>

<article class="main-article">
  <section class="main-visuals-container">
    <MainVisual />
  </section>
  <section class="vise-selector-container">
    <ViseSelector />
  </section>
</article>