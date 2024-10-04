<script>
  const {
    type = 'button',
    text = 'N/A',
    isDisabled = false,
  } = $props();
</script>

<style>
  .button {
    min-width: 6.0rem;
    min-height: 2.5rem;
    cursor: pointer;
    padding: var(--main-padding);

    color: var(--theme-white);
    background-color: var(--button-background-color);
    border-radius: var(--border-radius);
  }

  .button:disabled {
    filter: opacity(0.5);
    cursor: not-allowed;
  }
</style>

<button class='button' type={type} disabled={isDisabled}>{text}</button>