<script>
  import {
    AuthZModes,
  } from '$lib/controls/AuthZ/fsm/AuthZModes.js';
  import {
    store,
  } from './CredentialsFormStore.svelte.js';
  import {
    CredentialsFormStoreEvents as Events,
  } from './CredentialsFormStoreEvents.js';
  import * as m from '$lib/paraglide/messages.js';

  const AUTOCOMPLETE_DISABLED = 'off';

  const {
    /**
     * @type {function<Map<string, string>>}
    */
    OnSubmitAuthRequest,
  } = $props();

  let activeMode = $state(store.Mode);
  let login = $state(null);
  let password = $state(null);
  let pin = $state(null);
  let shouldDisableSubmitButton = $state(true);

  /**
   * 
   * @param {CustomEvent} e
   */
  const handleOnDataReady = (e) => {
    const {
      detail: {
        isReady,
      }
    } = e;

    shouldDisableSubmitButton = !isReady;
  };

  $effect(() => {
    store.addEventListener(Events.OnDataReady, handleOnDataReady);

    return () => {
      store.removeEventListener(Events.OnDataReady, handleOnDataReady);
    };
  });

  $effect(() => {
    store.Login = login;
  });

  $effect(() => {
    store.Password = password;
  });

  $effect(() => {
    store.Pin = pin;
  });

  /**
   * @type {HTMLFormElement | null}
   */
  let formElement = $state(null);

  $effect(() => {
    formElement?.addEventListener('submit', handleFormSubmit);

    return () => {
      formElement?.removeEventListener('submit', handleFormSubmit);
      formElement = null;
    };
  });

  $effect(() => {
    store.Mode = activeMode;
  });

  /**
   * 
   * @param {SubmitEvent} submitEvent
   */
  const handleFormSubmit = (submitEvent) => {
    submitEvent.stopImmediatePropagation();
    submitEvent.stopPropagation();
    submitEvent.preventDefault();

    let formData = new Map();

    formData.set('mode', store.Mode);
    formData.set('login', store.Login);
    formData.set('password', store.Password);

    switch(store.Mode) {
      // @ts-ignore
      case AuthZModes.AUTHENTICATION: {
        break;
      }
      case AuthZModes.REGISTRATION: {
        formData.set('pin', store.Pin);

        break;
      }
    }

    // @ts-ignore
    OnSubmitAuthRequest(formData);
  };

  const tabs = Object.freeze({
    [AuthZModes.REGISTRATION]: m.authzModeRegister(),
    [AuthZModes.AUTHENTICATION]: m.authzModeAuthenticate(),
  });
</script>

<style>
  #credentials-form {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, 1fr);
    grid-template-areas:
      'tabs'
      'login'
      'password'
      'pin'
      'button'
    ;
    gap: var(--main-grid-gap);
    padding: var(--main-padding);
    background-color: var(--ctrl-background-color);
    width: 15svw;
    font-size: calc(var(--main-font-size) * 0.8);

    & > .form-row {
      background-color: transparent;
    }

    & > .input-row {
      display: grid;
      grid-auto-flow: row;
      grid-template-rows: 1fr 2fr;
      gap: var(--main-grid-gap);
    }

    & > .button-row {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    & > .tabs {
      display: grid;
      grid-auto-flow: column;

      & > .tab {
        & > input[type='radio'] {
          display: none;
        }

        & > label {
          padding: var(--main-padding) 0;
          justify-content: center;
        }
      }
    }

    & > .tabs {
      grid-area: tabs;
    }

    & > .login {
      grid-area: login;
    }

    & > .password {
      grid-area: password;
    }

    & > .pin {
      grid-area: pin;
    }

    & > .button {
      grid-area: button;
      
      & > button {
        color: var(--main-color);
        background-color: var(--main-accent-background-color);
      }

      & > button:disabled {
        background-color: var(--theme-dark_gray);
        cursor: not-allowed;
        border: none;
      }
    }
  }

  #credentials-form {
    border-radius: var(--main-border-radius);
  }
</style>

<form
  id='credentials-form'
  name='credentials-form'
  autocomplete='on'
  bind:this={formElement}
>
  <div class='form-row tabs'>
    {#each Object.entries(tabs) as [id, tab]}
      <div class='tab'>
        <input type='radio' {id} value={id} name='tab' bind:group={activeMode} />
        <label for={id}>{tab}</label>
      </div>
    {/each}
  </div>
  <div class='form-row input-row login'>
    <label for='login-input'>{m.authzInputLoginLabel()}</label>
    <input
      id='login-input'
      type='text'
      autocomplete={activeMode === AuthZModes.REGISTRATION ? AUTOCOMPLETE_DISABLED : 'username'}
      placeholder={activeMode === AuthZModes.REGISTRATION ? m.authzInputLoginNewLoginPlaceholder() : m.authzInputLoginYourLoginPlaceholder()}
      required
      bind:value={login}
    />
  </div>
  <div class='form-row input-row password'>
    <label for='password-input'>{m.authzInputPasswordLabel()}</label>
    <input
      id='password-input'
      type='text'
      autocomplete={activeMode === AuthZModes.REGISTRATION ? 'new-password' : 'current-password'}
      placeholder={activeMode === AuthZModes.REGISTRATION ? m.authzInputPasswordNewPasswordPlaceholder() : m.authzInputPasswordYourPasswordPlaceholder()}
      required
      bind:value={password}
    />
  </div>
  {#if activeMode === AuthZModes.REGISTRATION}
    <div class='form-row input-row pin'>
      <label for='pin-input'>{m.authzInputPinLabel()}</label>
      <input
        id='pin-input'
        type='text'
        autocomplete={activeMode === AuthZModes.REGISTRATION ? 'one-time-code' : AUTOCOMPLETE_DISABLED}
        placeholder={m.authzInputPinPlaceholder()}
        required
        bind:value={pin}
      />
    </div>
  {:else}
    {null}
  {/if}
  <div class='form-row button-row button'>
    <button
      type='submit'
      disabled={shouldDisableSubmitButton}
    >
      {m.authzSubmitButtonText()}
    </button>
  </div>
</form>