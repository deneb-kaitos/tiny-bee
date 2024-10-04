<script>
  const {
    inputType = 'text',
    inputId = crypto.randomUUID(),
    inputName = crypto.randomUUID(),
    inputAutocomplete = 'off',
    isRequired = false,
    onchange = (value) => {},
  } = $props();
  let value = $state('');

  $effect(() => {
    onchange(value);
  });
</script>

<style>
  .input {
    font-size: 0.75rem;
    border-radius: var(--border-radius);
  }
</style>

<input
  id={inputId}
  class='input'
  type={inputType}
  name={inputName}
  autocomplete={inputAutocomplete}
  required={isRequired}
  bind:value={value}
/>
