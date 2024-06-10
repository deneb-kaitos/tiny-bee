<style>
  .vise-selector-ctrl {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: 1fr;
    grid-template-areas:
      'selector-control'
      'item-info'
    ;

    background-color: brown;
    
    & .selector-control {
      grid-area: selector-control;
    }

    & .item-info {
      grid-area: item-info;
    }
  }
</style>

<div class="vise-selector-ctrl">
  <div class="selector-control">selector control</div>
  <div class="item-info">item info</div>
</div>