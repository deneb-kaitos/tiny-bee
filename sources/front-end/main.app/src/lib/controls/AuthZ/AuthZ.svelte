<script>
  import {
    AuthZFSM,
    AuthZSignals,
  } from './fsm/AuthZ.fsm.js';
  import {
    AuthZCtx,
  } from './fsm/AuthZCtx.svelte.js';
  import {
    AuthZModes,
  } from './fsm/AuthZModes.js';
  import * as m from '$lib/paraglide/messages.js';

  /**
	 * @type {import("xstate").Actor<import("xstate").StateMachine<import("xstate").MachineContext, import("xstate").AnyEventObject, {}, never, never, never, never, {}, string, import("xstate").NonReducibleUnknown, import("xstate").NonReducibleUnknown, import("xstate").EventObject, import("xstate").MetaObject, import("xstate").ResolveTypegenMeta<import("xstate").TypegenDisabled, import("xstate").AnyEventObject, never, never, never, never, string, import("xstate").EventObject>>> | null}
	 */
  let authzFSM;

  // const signUp = AuthZModes.REGISTRATION;
  // const signIn = AuthZModes.AUTHENTICATION;
  const modeLocalization = Object.freeze({
    [AuthZModes.REGISTRATION]: m.authModeRegister(),
    [AuthZModes.AUTHENTICATION]: m.authModeAuthenticate(),
  });
  const tabs = Object.freeze({
    [AuthZModes.REGISTRATION]: AuthZModes.REGISTRATION,
    [AuthZModes.AUTHENTICATION]: AuthZModes.AUTHENTICATION,
  });
  let activeTab = $state(AuthZModes.REGISTRATION);
  let login = $state(null);
  let password = $state(null);
  let pin = $state(null);

  $effect(() => {
    authzFSM?.send({
      type: AuthZSignals.LOGIN_CHANGED,
      payload: {
        value: login,
      },
    });
  });

  //#region FSM
  const handleSnapshot = (snapshot = null) => {
    console.debug(
      `%c${self.name}@${snapshot.value}:`,
      'background-color:orange;color:white;padding:0 0.5rem;',
      snapshot
    );
  };
  const fsmAPI = {
    inspect: (/** @type {{ type: any; event: { type: any; }; }} */ inspectionEvent) => {
      switch(inspectionEvent.type) {
        case '@xstate.event': {
          console.debug(
            `%cinspection: %c${inspectionEvent.event.type}`,
            'background-color:lightgray;color:black;padding:0 0.5rem;',
            'background-color:orange;color:black;padding:0 0.5rem;',
            inspectionEvent.event,
          );
          break;
        }
      }
    },
  };
  //#endregion

  $effect(() => {
    authzFSM = AuthZFSM(fsmAPI, new AuthZCtx());
    authzFSM.subscribe(handleSnapshot);
    authzFSM.start();

    return () => {
      authzFSM?.stop();
      authzFSM = null;
    };
  });

  $effect(() => {
    authzFSM?.send({
      type: AuthZSignals.CHANGE_AUTH_MODE,
      payload: {
        value: activeTab,
      }
    });
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
            <label for={id}>{modeLocalization[tab]}</label>
          </li>
        {/each}
      </ul>
      <form class='tab-panel-content' onsubmit={handleFormSubmit}>
        <div class='tab-panel-content-row'>
          <label for='input-login'>{m.inputLoginLabel()}</label>
          <input
            id='input-login'
            type='text'
            placeholder={ activeTab === AuthZModes.REGISTRATION ? m.inputLoginNewLogin(): m.inputLoginYourLogin() }
            autocomplete='username'
            required
            bind:value={login}
          />
        </div>
        <div class='tab-panel-content-row'>
          <label for='input-password'>{m.inputPasswordLabel()}</label>
          <input
            id='input-password'
            type='password'
            placeholder={ activeTab === AuthZModes.REGISTRATION ? m.inputPasswordNewPassword() : m.inputPasswordYourPassword() }
            autocomplete={ activeTab === AuthZModes.REGISTRATION ? 'new-password' : 'current-password' }
            required
            bind:value={password}
          />
        </div>
        <div class='tab-panel-content-row'>
          <label for='input-pin'>{m.inputPinLabel()}</label>
          <input
            id='input-pin'
            type='text'
            placeholder='pin'
            autocomplete='one-time-code'
            disabled={activeTab === AuthZModes.AUTHENTICATION}
            bind:value={pin}
          />
        </div>
        <div class='tab-panel-content-row'>
          <button type='submit'>
            {modeLocalization[activeTab]}
          </button>
        </div>
      </form>
    </div>
</div>