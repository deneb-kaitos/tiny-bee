<script>
  import CredentialsForm from './CredentialsForm.svelte';
  // import {
  //   CredentialsFormStoreEvents as Events,
  // } from './CredentialsFormStoreEvents.js';

  /**
   * 
   * @param {Map<string, string>} e
   */
  const handleOnSubmitAuthRequest = (e) => {
    console.debug('handleOnSubmitAuthRequest', e);
  };


  $effect(() => {

    return () => {

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