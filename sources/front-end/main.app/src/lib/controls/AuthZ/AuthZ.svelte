<script>
  import {
    AuthZModes,
  } from './fsm/AuthZModes.js';
  import CredentialsForm from './CredentialsForm.svelte';
  import {
    store,
  } from './CredentialsFormStore.svelte.js';

  const handleOnModeChanged = (e) => {
    console.debug('handleOnModeChanged', e);
  };

  /**
   * 
   * @param {CustomEvent} e
   */
  const handleOnDataReady = (e) => {
    const {
      detail: {
        isReady,
      },
    } = e;

    console.debug('handleOnDataReady', isReady);
  };

  $effect(() => {
    store?.addEventListener('OnDataReady', handleOnDataReady);

    return () => {
      store?.removeEventListener('OnDataReady', handleOnDataReady);
    }
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
  <CredentialsForm />
</div>