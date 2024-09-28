<script>
  const {
    type = 'button',
    text = 'N/A',
  } = $props();
</script>

<style>
  .button {
    max-width: 6.0rem;
    max-height: 3.0rem;
    cursor: pointer;
    padding: var(--main-padding);

    background-color: var(--button-background-color);
  }
</style>

<button class='button' type={type}>{text}</button>