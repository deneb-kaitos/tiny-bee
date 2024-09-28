<script>
  import RegisterCtrl from "../RegisterCtrl/RegisterCtrl.svelte";
  import LoginCtrl from "../LoginCtrl/LoginCtrl.svelte";
</script>

<style>
  .enter {
    display: grid;
    grid-template-areas:
      'register login'
    ;
    min-height: 100svh;
    gap: var(--main-grid-gap);

    & > .register {
      grid-area: register;
    }

    & > .login {
      grid-area: login;
    }

    & > :is(.register, .login) {
      display: grid;
      place-items: center;
    }
  }
</style>

<article class='enter'>
  <section class='register'>
    <RegisterCtrl />
  </section>
  <section class='login'>
    <LoginCtrl />
  </section>
</article>