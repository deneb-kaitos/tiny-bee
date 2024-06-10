<script>
  import {
    SiteInfoStore,
  } from '$lib/stores/SiteInfo.svelte.js';
</script>
<style>
  footer {
    grid-area: footer;

    display: flex;
    justify-content: center;
    align-items: center;

    height: 4rem;
  }
</style>

<footer>
  {SiteInfoStore.Title}
</footer>