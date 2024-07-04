<script>
  const signUp = 'register';
  const signIn = 'login';
  const tabs = Object.freeze({
    signUp,
    signIn,
  });
  let activeTab = $state(signUp);
  let login = $state(null);
  let password = $state(null);
  let pin = $state(null);

  const credentials = {
    login: null,
    password: null,
    pin: null,
  };

  $effect(() => {
    login;
    password;
    pin;

    credentials.login = login;
    credentials.password = password;
    credentials.pin = pin;

    console.debug({ credentials });
  });

  $effect(() => {
    console.debug(`activeTab: ${activeTab}`);
  });
  
  /**
   * 
   * @param {SubmitEvent} e
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

    console.debug(e);

    return false;
  }
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
          display: flex;
          justify-content: center;
          align-items: center;

          font-size: calc(var(--main-font-size) / 2);
          aspect-ratio: var(--main-aspect-ratio);
          width: 2.5svw;
        }

        & > input[type='radio']:checked ~ label {
          background-color: var(--theme-blue);
          color: var(--theme-darkest_white);
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
      gap: calc(var(--main-grid-gap) * 2.5);

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

        & > input::placeholder {
          color: var(--theme-light_gray_bright);
        }

        & > button {
          border-radius: var(--main-border-radius);
          background-color: var(--theme-green);
          padding: var(--main-padding);
          font-size: var(--main-font-size);
        }

        & > label {
          font-size: calc(var(--main-font-size) * 0.65);
          color: var(--theme-white);
          padding-left: 0.8rem;
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
      <form class='tab-panel-content' onsubmit={handleFormSubmit}>
        <div class='tab-panel-content-row'>
          <label for='input-login'>login</label>
          <input
            id='input-login'
            type='text'
            placeholder={ activeTab === signUp ? 'new login': 'your login' }
            autocomplete='username'
            required
            bind:value={login}
          />
        </div>
        <div class='tab-panel-content-row'>
          <label for='input-password'>password</label>
          <input
            id='input-password'
            type='password'
            placeholder={ activeTab === signUp ? 'new password' : 'your password' }
            autocomplete={ activeTab === signUp ? 'new-password' : 'current-password' }
            required
            bind:value={password}
          />
        </div>
        <div class='tab-panel-content-row'>
          <label for='input-pin'>pin</label>
          <input
            id='input-pin'
            type='text'
            placeholder='pin'
            autocomplete='one-time-code'
            disabled={activeTab === signIn}
            bind:value={pin}
          />
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