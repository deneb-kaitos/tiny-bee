<script>
  const {
    children,
  } = $props();
</script>

<style>
  .h1 {
    margin: 0;
    padding: 0;
  }
</style>

<h1 class='h1'>
  {#if children}
    {@render children()} 
  {/if}
</h1>