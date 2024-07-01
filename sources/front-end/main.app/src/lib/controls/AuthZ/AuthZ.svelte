<style>
  #authz-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100svh;

    & > #authz-panel {
      padding: var(--main-padding);
      aspect-ratio: var(--main-aspect-ratio);
      max-width: 95svw;
      border-radius: var(--main-border-radius);
      background-color: var(--theme-black);
      filter: drop-shadow(var(--filter-drop-shadow-x) var(--filter-drop-shadow-y) var(--filter-drop-shadow-blur) var(--theme-black));
    }
  }

  .tab-panel {
    border: 1px solid brown;
    padding: var(--main-padding);

    & > .tab-panel-tabs {
      list-style-type: none;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: space-evenly;
      align-items: center;

      & > li {
        cursor: pointer;
      }
    }

    & > .tab-panel-content {
      padding: var(--main-padding);
      border: 1px solid yellow;
      display: grid;
      grid-template-columns: 1fr;
      grid-auto-flow: row;
      gap: var(--main-grid-gap);
      grid-auto-rows: 1fr;

      & > .tab-panel-content-row {
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-flow: row;
        grid-auto-rows: 1fr;
        gap: var(--main-grid-gap);
        justify-items: stretch;
        align-items: center;

        border: 1px solid greenyellow;

        & > button[type=submit] {
          justify-self: center;
        }
      }
    }
  }
</style>

<div id='authz-container'>
  <div id='authz-panel'>
    <div class='tab-panel'>
      <ul class='tab-panel-tabs'>
        <li>sign-in</li>
        <li>sign-up</li>
      </ul>
      <form class='tab-panel-content'>
        <div class='tab-panel-content-row'>
          <label for='input-login'>login</label>
          <input id='input-login' type='text' value='login' />
        </div>
        <div class='tab-panel-content-row'>
          <label for='input-password'>password</label>
          <input id='input-password' type='password' value='password' />
        </div>
        <div class='tab-panel-content-row'>
          <label for='input-pin'>pin</label>
          <input id='input-pin' type="text" value='pin' />
        </div>
        <div class='tab-panel-content-row'>
          <button type='submit'>send</button>
        </div>
      </form>
    </div>
  </div>
</div>