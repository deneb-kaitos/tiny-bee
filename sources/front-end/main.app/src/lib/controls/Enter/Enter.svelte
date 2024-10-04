<script>
  import AuthZForm from "$lib/controls/AuthZForm/AuthZForm.svelte";
  import { AuthZMode } from "$lib/controls/AuthZForm/AuthZMode.svelte.js";

  /**
   * 
   * @param {Object | null | undefined} fields
   */
  const handleOnValues = (fields = null) => {
    console.debug({ fields });
  };
</script>

<style>
  .enter {
    --register-bg-color: var(--theme-green);
    --login-bg-color: var(--theme-glacier);

    display: grid;
    grid-template-areas:
      'register login'
    ;
    min-height: 100svh;
    background-color: var(--theme-none);

    & > .register {
      grid-area: register;
      justify-items: end;
      background-color: var(--register-bg-color);
    }

    & > .login {
      grid-area: login;
      justify-items: start;
      background-color: var(--login-bg-color);
    }

    & > :is(.register, .login) {
      display: grid;
      align-items: center;
      container-type: inline-size;
      padding: var(--main-padding);
    }
  }
</style>

<article class='enter'>
  <section class='register'>
    <AuthZForm
      mode={AuthZMode.register}
      formLegend="register account"
      onValues={handleOnValues}
    />
  </section>
  <section class='login'>
    <AuthZForm
      mode={AuthZMode.login}
      formLegend="login"
      onValues={handleOnValues}
    />
  </section>
</article>