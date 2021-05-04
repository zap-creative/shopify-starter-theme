<script>
  import { fly, fade } from 'svelte/transition';

  export let index = 0;
  export let title;
  export let url;
  export let wide = false;
</script>

<style>
  li {
    align-items: stretch;
    flex: 0 0 auto;
    width: 100%;
  }

  a {
    @apply py-2;

    background-color: var(--c-card);
    color: var(--c-card-text);
    display: flex;
    flex-flow: row wrap;
    width: 100%;
  }

  @screen small {
    li:not(.wide) {
      min-width: 280px;
      width: 50%;
    }

    a {
      flex-wrap: nowrap;
    }
  }
</style>

<li role="option" class="{wide ? 'wide' : ''}"
  in:fly="{{ duration: 300, delay: (index * 20), y: 120, opacity: 0.5 }}"
  out:fade="{{ duration: 250 }}"
>
  <a href="{url}" title="{title}">
    <slot></slot>
  </a>
</li>