<script>
  import Button from "$lib/controls/Button/Button.svelte";
  import Input from "$lib/controls/Input/Input.svelte";
  import { AuthZMode } from "./AuthZMode.svelte.js";

  const {
    mode = AuthZMode.register,
    formLegend = 'N/A',
    onValues,
  } = $props();

  let username = $state('');
  let password = $state('');
  let pin = $state('');
  let isAllFieldsDefined = $state(false);

  const username_id = crypto.randomUUID();
  const password_id = crypto.randomUUID();
  const pin_id = crypto.randomUUID();

  $effect(() => {
    isAllFieldsDefined = username.length > 0 && password.length > 0 && ( mode === AuthZMode.login || pin.length > 0 );
  });

  /**
   * 
   * @param {SubmitEvent} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const fields = Array.from (e.target?.elements).filter((input) => input.nodeName === 'INPUT').reduce((acc, val) => {
      return {
        ...acc,
        [val.name]: val.value,      
      };
    }, {
      mode,
    });

    if ( typeof(onValues) === 'function' ) {
      onValues(fields);
    }
  }
</script>

<style>
  .authz-form {
    display: grid;
    grid-template-areas:
      'legend'
      'username-container'
      'pass-container'
      'pin-container'
      'submit-button-container'
    ;
    grid-auto-rows: 1fr;
    gap: var(--main-grid-gap);
    border-radius: var(--border-radius);
    background-color: var(--ctrl-background-color);

    & > .formLegend {
      text-transform: uppercase;
      font-weight: 900;
      font-variation-settings: "wght" 900, "opsz" 32;
      font-size: calc(var(--main-font-size) * var(--h-coeff));

      display: flex;
      justify-content: center;
      align-content: center;

      flex-wrap: wrap;
    }

    & > .form-row {
      display: grid;
      grid-auto-flow: row;
      gap: var(--main-grid-gap);
      padding: min(1svh, 1svw);
      
      & > label {
        font-size: 0.75rem;
      }
    }

    & > legend {
     grid-area: legend; 
    }

    .align-items-end {
      place-items: self-end;
    }

    & > .username-container {
      grid-area: username-container;
    }

    & > .pass-container {
      grid-area: pass-container;
    }

    & > .pin-container {
      grid-area: pin-container;
    }

    & > .submit-button-container {
      grid-area: submit-button-container;
    }
  }

  @container (width > 1000px) {
    .authz-form {
      width: 25%;
    }
  }
</style>

<form class='authz-form' name='authZ' onsubmit={handleSubmit} autocapitalize="off">
  <legend class='formLegend'>{formLegend}</legend>
  <div class='form-row username-container'>
    <label for={username_id}>{ mode === AuthZMode.register ? 'new user name' : 'your user name' }</label>
    <Input
      inputId={username_id}
      inputType='text'
      inputName='username'
      inputAutocomplete='username'
      isRequired={true}
      onchange={(value) => username = value}
    />
  </div>
  <div class='form-row pass-container'>
    <label for={password_id}>{ mode === AuthZMode.register ? 'new password' : 'your password' }</label>
    <Input
      inputId={password_id}
      inputType='password'
      inputName='password'
      inputAutocomplete={ mode === AuthZMode.register ? 'new-password' : 'current-password' }
      isRequired={true}
      onchange={(value) => password = value}
    />
  </div>
  <div class='form-row pin-container'>
    {#if mode === AuthZMode.register}
      <label for={pin_id}>PIN</label>
      <Input
        inputId={pin_id}
        inputType='text'
        inputName='pin'
        isRequired={true}
        onchange={(value) => pin = value}
      />
    {:else}
      &nbsp;
    {/if}
  </div>
  <div class='form-row submit-button-container align-items-end'>
    <Button
      type='submit'
      text={ mode === AuthZMode.register ? 'register' : 'login' }
      isDisabled={!isAllFieldsDefined}
    />
  </div>
</form>