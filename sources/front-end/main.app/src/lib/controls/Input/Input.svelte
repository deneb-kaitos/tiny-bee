<script>
  const {
    inputType = 'text',
    inputId = crypto.randomUUID(),
    inputName = crypto.randomUUID(),
    inputAutocomplete = 'off',
    isRequired = false,
  } = $props();
</script>

<style>
  .input {
    font-size: 0.75rem;
  }
</style>

<input
  id={inputId}
  class='input'
  type={inputType}
  name={inputName}
  autocomplete={inputAutocomplete}
  required={isRequired}
/>
