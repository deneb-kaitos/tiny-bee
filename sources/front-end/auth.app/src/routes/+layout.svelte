<script>
	import 'inter-ui/inter-variable.css';
	// import { env } from '$env/dynamic/public';
  import Header from '$lib/containers/Header/Header.svelte';
  import Footer from '$lib/containers/Footer/Footer.svelte';

  const { children } = $props();

  $effect(() => {
    // initData().then(() => {
    //   console.log('fake data has been initialized');
    // });
  });
</script>

<style>
  .layout-root {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      'header-container'
      'main'
      'footer-container'
    ;
    gap: 1rem;
  

    /* height: 100svh; */
    min-height: 100svh;
    max-height: 100svh;
  }
  .header-container {
    grid-area: header-container;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
  }

  main {
    grid-area: main;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .footer-container {
    grid-area: footer-container;
    bottom: 0;
  }

  .header-container, .footer-container {
    position: sticky;
  }
</style>

<div class="layout-root">
  <div class="header-container">
    <Header />
  </div>
  <main>
    {@render children()}
  </main>
  <div class="footer-container">
    <Footer />
  </div>
</div>