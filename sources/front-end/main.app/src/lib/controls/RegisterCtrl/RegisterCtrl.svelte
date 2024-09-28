<script>
  import Button from "../Button/Button.svelte";
  import Input from "../Input/Input.svelte";

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.debug('handleSubmit');
  }
</script>

<style>
  .account-registration-form {
    display: grid;
    grid-template-areas:
      'username-container'
      'pass-container'
      'pin-container'
      'submit-button-container'
    ;
    max-width: 50%;
    gap: var(--main-grid-gap);
    background-color: var(--ctrl-background-color);

    & > .form-row {
      display: grid;
      grid-auto-flow: row;
      gap: var(--main-grid-gap);
      padding: min(1svh, 1svw);
      
      & > label {
        font-size: 0.75rem;
      }

    }

    .align-items-end {
      place-items: self-end;
    }

    & > .username-container {
      grid-area: username-container;
    }

    & > .pass-container {
      grid-area: pass-container;
    }

    & > .pin-container {
      grid-area: pin-container;
    }

    & > .submit-button-container {
      grid-area: submit-button-container;
    }
  }
</style>

<form class='account-registration-form' name='accountRegistrationForm' onsubmit={handleSubmit} autocapitalize="off">
  <div class='form-row username-container'>
    <label for='username-id'>user name</label>
    <!-- <input type='text' id='username-id' name='username' autocomplete='username' required /> -->
    <Input
      inputId='username-id'
      inputType='text'
      inputName='username'
      inputAutocomplete='username'
      isRequired={true}
    />
  </div>
  <div class='form-row pass-container'>
    <label for='new-password-id'>new password</label>
    <input type='password' id='new-password-id' name='newPassword' autocomplete='new-password' required />
  </div>
  <div class='form-row pin-container'>
    <label for='pin-id'>PIN</label>
    <input type='text' id='pin-id' name='pin' required />
  </div>
  <div class='form-row submit-button-container align-items-end'>
    <Button
      type='submit'
      text='register'
    />
  </div>
</form>