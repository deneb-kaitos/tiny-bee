<script>
	import 'inter-ui/inter-variable.css';
  import {
    ProtocolMessageTypes,
  } from '$lib/workers/ProtocolMessageTypes.js';

  /**
	 * @type {Worker | null}
	 */
  let ldr = $state(null);

  /**
   * 
   * @param e {BeforeUnloadEvent}
   */
  const handle_beforeunload = (e) => {
    window.removeEventListener('beforeunload', handle_beforeunload);

    ldr?.postMessage({
      type: ProtocolMessageTypes.DISPOSE,
      payload: null,
    });

    ldr?.terminate();
  }

  $effect(() => {
    window.addEventListener('beforeunload', handle_beforeunload);

    if (ldr === null) {
      ldr = new Worker(new URL('$lib/workers/ldr/ldr.js', import.meta.url), {
        type: 'module',
        name: 'ldr',
      });

      ldr?.postMessage({
        type: ProtocolMessageTypes.INIT,
        payload: null,
      });
    }
  });

  const { children } = $props();

</script>

<svelte:head>
  <title>tiny bee</title>
</svelte:head>

{@render children()}