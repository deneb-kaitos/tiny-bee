<script>
  import CredentialsForm from './CredentialsForm.svelte';
  import {
    AuthZModes,
  } from './fsm/AuthZModes.js';
  import {
    BroadcastChannelName,
  } from '../../workers/BroadcastChannelName.js';
  // import {
  //   MessageType,
  // } from '$lib/workers/serde/SerDeManager/MessageType.js';
  import {
    OperationType,
  } from '$lib/workers/serde/SerDeManager/OperationType.js';
  import {
    createBroadcastMessage,
  } from '$lib/workers/helpers/createBroadcastMessage.js';

  /**
   * @type {BroadcastChannel | null}
   */
  let serdeBroadcastChannel = null;
  /**
   * @type {BroadcastChannel | null}
   */
  let commBroadcastChannel = null;
  /**
   * @type {BroadcastChannel | null}
   */
  let ownBroadcastChannel = null;

  /**
   * 
   * @param {Map<string, string>} e
   */
  const handleOnSubmitAuthRequest = (e) => {
    console.debug('handleOnSubmitAuthRequest', e);

    let credentials = null;
    let mode = e.get('mode');

    switch(mode) {
      case AuthZModes.REGISTRATION: {
        credentials = Object.freeze({
          login: e.get('login'),
          password: e.get('password'),
          pin: e.get('pin') || null,
        });

        break;
      }
      case AuthZModes.AUTHENTICATION: {
        credentials = Object.freeze({
          login: e.get('login'),
          password: e.get('password'),
        });

        break;
      }
      default: {
        throw new TypeError(`unexpected mode: ${e.get('mode')}`);
      }
    }

    const message = createBroadcastMessage({
      type: OperationType.serialize,
      meta: {
        returnTo: ownBroadcastChannel?.name,
      },
      payload: {
        // type: MessageType.AccountRegistrationRequest,
        value: credentials,
      }
    });

    serdeBroadcastChannel?.postMessage(message);
  };

  /**
   * 
   * @param {MessageEvent} e
   */
  const handleSerdeBroadcastChannelMessage = (e) => {
    console.debug('handleSerdeBroadcastChannelMessage', e);
  };

  /**
   * 
   * @param {MessageEvent} e
   */
  const handleOwnBroadcastChannelMessage = (e) => {
    const {
      data: {
        type,
        payload,
      },
    } = e;

    console.debug('handleOwnBroadcastChannelMessage', type, payload);

    switch(type) {
      // case MessageType.AccountRegistrationRequest: {
      //   console.debug(`now send the ${type} bytes to the COMM worker`);
      //   const message = createBroadcastMessage({
      //     type,
      //     meta: null,
      //     payload,
      //   });
      //   commBroadcastChannel?.postMessage(message);

      //   break;
      // }
      default: {
        throw new TypeError(`message type (${type}) is unexpected`);
      }
    }
  };


  $effect(() => {
    serdeBroadcastChannel = new BroadcastChannel(BroadcastChannelName.SERDE);
    serdeBroadcastChannel.addEventListener('message', handleSerdeBroadcastChannelMessage);

    commBroadcastChannel = new BroadcastChannel(BroadcastChannelName.COMM);

    ownBroadcastChannel = new BroadcastChannel(crypto.randomUUID());
    ownBroadcastChannel.addEventListener('message', handleOwnBroadcastChannelMessage);

    return () => {
      serdeBroadcastChannel?.removeEventListener('message', handleSerdeBroadcastChannelMessage);
      serdeBroadcastChannel?.close();
      serdeBroadcastChannel = null;

      commBroadcastChannel?.close();
      commBroadcastChannel = null;

      ownBroadcastChannel?.removeEventListener('message', handleOwnBroadcastChannelMessage);
      ownBroadcastChannel?.close();
      ownBroadcastChannel = null;
    };
  });
</script>

<style>
  #authz-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100svh;
  }
</style>

<div id='authz-container'>
  <CredentialsForm OnSubmitAuthRequest={handleOnSubmitAuthRequest} />
</div>