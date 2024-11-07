<script>
  import AuthZForm from "$lib/controls/AuthZForm/AuthZForm.svelte";
  import { AuthZMode } from "$lib/controls/AuthZForm/AuthZMode.svelte.js";
  import { fieldsToAuthObject } from '$lib/messageObjects/fieldsToAuthObject.mjs';
  import {
    BroadcastChannelName,
  } from '$lib/workers/BroadcastChannelName.js';
  import {
    OperationType,
  } from '$lib/workers/serde/SerDeManager/OperationType.js';
  import {
    MessageType,
  } from '$lib/workers/serde/SerDeManager/MessageType.js';

  /**
   * @type {BroadcastChannel | null}
   */
  let returnToBroadcastChannel = null;

  /**
   * @param {MessageEvent | null} e
   */
  const handleReturnToMessage = (e) => {
    returnToBroadcastChannel?.removeEventListener('message', handleReturnToMessage);
    returnToBroadcastChannel?.close();

    if (e?.isTrusted === false) {
      throw new TypeError('handleReturnToMessage(e): e.isTrusted === false');
    }

    const {
      data: {
        payload,
      },
    } = e;

    console.debug('handleReturnToMessage', payload);
  };

  /**
   * 
   * @param { Object | null } fields
   */
  const handleOnValues = (fields = null) => {
    /**
     * TODO:
     * 1. send fields for serialization
     * 2. get serialized message ( SM )
     * 3. send SM to communicator
    */

    const messageObject = fieldsToAuthObject(MessageType.AccountRegistrationRequest, OperationType.serialize, fields);
    messageObject.meta.returnTo = returnToBroadcastChannel?.name;

    const serde = new BroadcastChannel(BroadcastChannelName.SERDE);
    serde.postMessage(messageObject);
    serde.close();
  };

  $effect(() => {
    returnToBroadcastChannel = new BroadcastChannel(crypto.randomUUID());
    returnToBroadcastChannel.addEventListener('message', handleReturnToMessage);
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
      onValues={handleOnValues}
    />
  </section>
  <section class='login'>
    <AuthZForm
      mode={AuthZMode.login}
      formLegend="login"
      onValues={handleOnValues}
    />
  </section>
</article>