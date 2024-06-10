<script>
  import {
    page,
  } from '$app/stores';
  import {
    SiteInfoStore,
  } from '$lib/stores/SiteInfo.svelte.js';
</script>

<style>
  header {
    --bottom-size: 0.125rem;

    grid-area: header;
    display: grid;
    grid-template-columns: 1fr;
    /* grid-template-rows: repeat(2, 1fr); */
    grid-template-rows: 1fr;
    grid-template-areas:
      'title'
      /* 'nav' */
    ;
  }

  header > h1 {
    grid-area: title;
    line-height: normal;
  }


  /* header > nav {
    grid-area: nav;
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;

    background-color: var(--theme-black);
    border-radius: var(--border-radius);
    padding: var(--bottom-size) 2rem;
  } */

  header > :is(h1, nav) {
    justify-self: center;
    align-self: stretch;
  }

  /* header > nav > :is(a) {
    display: flex;
    justify-content: stretch;
    align-items: center;
    padding: 0 1rem;
    border-bottom: var(--bottom-size) solid transparent;
  } */
  
  header :is(a) {
    color: var(--theme-glacier);
    text-decoration: none;
  }

  /* header > nav:hover > a:not(.isActiveLink) {
    filter: blur(1px);
  } */

  /* header > nav:hover > a:hover {
    filter: none;
  } */

  /* .isActiveLink {
    border-bottom-color: var(--theme-green);
    filter: none;
  } */
</style>

<header>
  <h1>
    <a href="/">
      {SiteInfoStore.Title}
    </a>
  </h1>
  <!-- <nav>
    <a href="/suppliers" class:isActiveLink={ $page.route.id === '/suppliers' }>suppliers</a>
    <a href="/employees" class:isActiveLink={ $page.route.id === '/employees' }>employees</a>
    <a href="/security" class:isActiveLink={ $page.route.id === '/security' }>security</a>
  </nav> -->
</header>