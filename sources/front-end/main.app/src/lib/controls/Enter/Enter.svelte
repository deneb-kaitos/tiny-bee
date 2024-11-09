<script>
  import AuthZForm from "$lib/controls/AuthZForm/AuthZForm.svelte";
  import { AuthZMode } from "$lib/controls/AuthZForm/AuthZMode.svelte.js";
  import {
    BroadcastChannelName,
  } from '$lib/workers/BroadcastChannelName.js';
  import {
    OperationType,
  } from '$lib/workers/serde/SerDeManager/OperationType.js';
  import {
    AccountRegistrationRequest,
  } from '$lib/workers/serde/SerDeManager/classes/AccountRegistrationRequest.js';
  import {
    AccountAuthenticationRequest,
  } from '$lib/workers/serde/SerDeManager/classes/AccountAuthenticationRequest.js';

  /**
   * @type {BroadcastChannel | null}
   */
  let returnToBroadcastChannel = null;

  /**
   * @param {MessageEvent} e
   */
  const handleReturnToMessage = (e) => {
    const {
      data: {
        payload,
      },
    } = e;

    console.debug('handleReturnToMessage', payload);
  };

  /**
   * 
   * @param {object} fields
   * @param {string} fields.username - a user name
   * @param {string} fields.password- a user password
   * @param {string=} fields.pin - an invitation pin
   */
  // @ts-ignore
  const handleAuthZValues = (fields = null) => {
    /**
     * TODO:
     * 1. send fields for serialization
     * 2. get serialized message ( SM )
     * 3. send SM to communicator
    */

    if ( fields === null ) {
      throw ReferenceError('fields is undefined');
    }

    const message = {
      type: OperationType.serialize,
      meta: {
        returnTo: returnToBroadcastChannel?.name,
      },
      /**
       * @type {null | object}
      */
      payload: null,
    };

    message.payload = Object.hasOwn(fields, 'pin') === true ? 
      new AccountRegistrationRequest(fields.username, fields.password, fields.pin) : 
      new AccountAuthenticationRequest(fields.username, fields.password);
   
    const serde = new BroadcastChannel(BroadcastChannelName.SERDE);
    serde.postMessage(message);
    serde.close();
  };

  $effect(() => {
    returnToBroadcastChannel = new BroadcastChannel(crypto.randomUUID());
    returnToBroadcastChannel.addEventListener('message', handleReturnToMessage);

    return () => {
      returnToBroadcastChannel?.removeEventListener('message', handleReturnToMessage);
      returnToBroadcastChannel?.close();
    };
  });
</script>

<style>
  .enter {
    --register-bg-color: var(--theme-green);
    --login-bg-color: var(--theme-glacier);

    display: grid;
    grid-template-areas:
      'register login'
    ;
    min-height: 100svh;
    background-color: var(--theme-none);

    & > .register {
      grid-area: register;
      justify-items: end;
      background-color: var(--register-bg-color);
    }

    & > .login {
      grid-area: login;
      justify-items: start;
      background-color: var(--login-bg-color);
    }

    & > :is(.register, .login) {
      display: grid;
      align-items: center;
      container-type: inline-size;
      padding: var(--main-padding);
    }
  }
</style>

<article class='enter'>
  <section class='register'>
    <AuthZForm
      mode={AuthZMode.register}
      formLegend="register account"
      onValues={handleAuthZValues}
    />
  </section>
  <section class='login'>
    <AuthZForm
      mode={AuthZMode.login}
      formLegend="login"
      onValues={handleAuthZValues}
    />
  </section>
</article>