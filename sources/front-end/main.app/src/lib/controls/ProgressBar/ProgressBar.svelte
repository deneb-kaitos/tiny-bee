<script>
  const {
    maxSteps = 0,
  } = $props();
</script>

<style>
  .progress-bar {
    height: 0.5rem;
    width: 100%;
  }
  /* .progress-bar:not([value]), */
  .progress-bar[value]::-webkit-progress-bar {
    background-color: #eee;
    border-radius: 2px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
  }

  .progress-bar[value]::-webkit-progress-value {
    background-color: var(--theme-red);
  }
</style>

<progress class='progress-bar' value="{maxSteps / 10}" max="{maxSteps}" aria-label='progress'></progress>