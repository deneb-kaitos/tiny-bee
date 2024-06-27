<script>
  import BootModule from "./BootModule.svelte";
  import ProgressBar from "../ProgressBar/ProgressBar.svelte";

  const {
    /**
     * @type {Number} maxSteps
    */
    maxSteps = 0,
  } = $props();
</script>
<style>
  #boot-info-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 100svh;
  
    & > #boot-info-panel {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: 1fr 1fr 0.5fr;
      grid-template-areas:
        'header header header'
        '. modules .'
        'progressbar progressbar progressbar'
      ;
      gap: var(--main-grid-gap);
      padding: calc(var(--main-padding) * 2);
      aspect-ratio: 9/6;
      min-width: 20svw;
      border-radius: var(--main-border-radius);

      background-color: var(--theme-black);

      & > #boot-caption {
        grid-area: header;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      & > #boot-modules {
        grid-area: modules;
        list-style-type: none;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        gap: var(--main-grid-gap);
        margin: 0;
        padding: 0;

        & > li {
          display: contents;
        }
      }

      & > #progress-bar {
        grid-area: progressbar;
        display: flex;
        justify-content: stretch;
        align-items: center;
      
        & > progress[value] {
          height: 0.5rem;
          width: 100%;

          -webkit-appearance: none;
          appearance: none;
        }
      }
    }
  }
</style>

<article id='boot-info-container'>
  <div id='boot-info-panel'>
    <h1 id='boot-caption'>
      loading
    </h1>
    <ul id='boot-modules'>
      <li>
        <BootModule 
          name="comm"
          ctor={true}
          init={false}
          run={false}
        />
      </li>
      <li>
        <BootModule
          name="app"
          ctor={true}
          init={false}
          run={false}
        />
      </li>
    </ul>
    <div id='progress-bar'>
      <!-- <progress value="{maxSteps / 10}" max="{maxSteps}" aria-label='progress'></progress> -->
      <ProgressBar
        maxSteps
      />
    </div>
  </div>
</article>