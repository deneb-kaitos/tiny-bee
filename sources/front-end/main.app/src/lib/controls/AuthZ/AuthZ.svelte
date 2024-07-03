<script>
  const signUp = 'register';
  const signIn = 'login';
  const tabs = Object.freeze({
    signUp,
    signIn,
  });
  let activeTab = $state(signUp);

  $effect(() => {
    console.debug(`activeTab: ${activeTab}`);
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

  .tab-panel {
      padding: var(--main-padding);
      max-width: max(20svw, 20svh);
      border-radius: var(--main-border-radius);
      background-color: var(--theme-black);
      filter: drop-shadow(var(--filter-drop-shadow-x) var(--filter-drop-shadow-y) var(--filter-drop-shadow-blur) var(--theme-black));

    & > .tab-panel-tabs {
      list-style-type: none;
      margin: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      & > li {
        display: contents;

        & > label {
          cursor: pointer;
          padding: var(--main-padding);
          border-radius: var(--main-border-radius);
          color: var(--theme-white);
        }

        & > input[type='radio']:checked ~ label {
          background-color: var(--theme-green);
          color: var(--theme-black);
        }

        & > input[type='radio'] {
          display: none;
        }
      }
    }

    & > .tab-panel-content {
      display: grid;
      grid-template-columns: 1fr;
      grid-auto-flow: row;
      grid-auto-rows: 1fr;
      gap: var(--main-grid-gap);

      & > .tab-panel-content-row {
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-flow: row;
        gap: var(--main-grid-gap);
        justify-items: stretch;
        align-items: center;

        & > button[type=submit] {
          justify-self: center;
          cursor: pointer;

          aspect-ratio: var(--main-aspect-ratio);
          min-width: min(5svw, 5svh);
        }

        & > input[type='text'],
        & > input[type='password'] {
          font-size: var(--main-font-size);
          background-color: var(--theme-dark_gray);
        }

        & > input {
          border-radius: var(--main-border-radius);
          padding: var(--main-padding);
        }

        & > input:disabled {
          filter: opacity(0.5);
        }

        & > button {
          border-radius: var(--main-border-radius);
          background-color: var(--theme-green);
          padding: var(--main-padding);
          font-size: var(--main-font-size);
        }

        & > label {
          color: var(--theme-white);
        }
      }
    }

    & > .tab-panel-content {
      padding: var(--main-padding);
    }
  
  }
</style>

<div id='authz-container'>
    <div class='tab-panel'>
      <ul class='tab-panel-tabs' role='radiogroup'>
        {#each Object.entries(tabs) as [id, tab]}
          <li>
            <input type='radio' {id} value={tab} name='tab-panel-tab' bind:group={activeTab} />
            <label for={id}>{tab}</label>
          </li>
        {/each}
      </ul>
      <form class='tab-panel-content'>
        <div class='tab-panel-content-row'>
          <label for='input-login'>login</label>
          <input id='input-login' type='text' placeholder='login' autocomplete='username' required />
        </div>
        <div class='tab-panel-content-row'>
          <label for='input-password'>password</label>
          <input
            id='input-password'
            type='password'
            placeholder='password'
            autocomplete={ activeTab === signUp ? 'new-password' : 'current-password' }
            required
          />
        </div>
        <div class='tab-panel-content-row'>
          <label for='input-pin'>pin</label>
          <input id='input-pin' type="text" placeholder='pin' autocomplete='one-time-code' disabled={activeTab === signIn} />
        </div>
        <div class='tab-panel-content-row'>
          <button type='submit'>
            {#if activeTab === signIn}
              enter
            {:else}
              register
            {/if}
          </button>
        </div>
      </form>
    </div>
</div>