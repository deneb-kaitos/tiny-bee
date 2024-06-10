<script>
  import MainVisual from '$lib/controls/MainVisual/MainVisual.svelte';
  import ViseSelector from '$lib/controls/ViseSelector/ViseSelector.svelte';
</script>

<style>
  .authentication-article {
    display: block;

    & #authentication-form {
      --form-width: 800px;
      --form-height: 600px;
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-rows: 1fr;
        grid-template-areas:
          'legend-row'
          'login-row'
          'password-row'
          'pin-row'
          'submit-button-row'
        ;

      gap: 0.5rem;

      padding: 0.5rem;
      position: relative;
      top: calc(50% + var(--form-height) /  2);
      margin: 0 auto;

      width: var(--form-width);
      /* height: var(--form-height); */
      background-color: yellowgreen;
        
        & .form-row {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: auto 1fr;
          grid-template-areas:
            'label'
            'control'
          ;
          gap: calc(var(--main-grid-gap) / 2);
          padding: 0.25rem;
          background-color: brown;
        }

        & :is(label) { 
          grid-area: label;
          font-size: calc(var(--main-font-size) * 0.9);
        }

        & :is(input, button) {
          grid-area: control;
        }
        
        & .legend-row {
          grid-area: legend-row;
        }

        & .login-row {
          grid-area: login-row;
        }

        & .password-row {
          grid-area: password-row;
        }

        & .pin-row {
          grid-area: pin-row;
        }

        & .submit-button-row {
          grid-area: submit-button-row;
        }
      }
  }
</style>

<article class="authentication-article">
  <form id="authentication-form">
      <div class="legend-row">bla-bla-bla</div>
      <div class="form-row login-row">
        <label for="login">login</label>
        <input id="login" type="text" />
      </div>
      <div class="form-row password-row">
        <label for="password">password</label>
        <input id="password" type="password" />
      </div>
      <div class="form-row pin-row">
        <label for="pin">pin</label>
        <input id="pin" type="text" />
      </div>
      <div class="form-row submit-button-row">
        <button type="submit">ok</button>
      </div>
  </form>
</article>