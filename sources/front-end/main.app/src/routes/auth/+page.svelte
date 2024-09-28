<script>
  import {
    goto,
  } from '$app/navigation';
  import {
    isAuthenticated,
  } from '$lib/workers/sec/helpers/isAuthenticated';
  import AuthZ from '$lib/controls/AuthZ/AuthZ.svelte';
  import Enter from '$lib/controls/Enter/Enter.svelte';

  $effect(() => {
    isAuthenticated()
      .then((isAuthed = false) => {
        if (isAuthed === true) {
          goto('/', {
            replaceState: true,
          });
        }
      })
      .catch((authErr) => {
        console.error(authErr);
      });
  });
</script>

{#await isAuthenticated()}
  {@html '&nbsp;'}
{:then isAuthed}
 {#if isAuthed === false}
  <Enter />
 {/if} 
{/await}