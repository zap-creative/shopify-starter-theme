<script>
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let url;
  export let index = 0;
</script>


<style>
  @layer components {
    a {
      @apply flex flex-row p-2;

      background-color: var(--color-card);
      color: var(--color-card-text);
    }
  }
</style>

<li role="option"
  in:fly="{{
    duration: 300,
    delay: (index * 20),
    y: 120,
    opacity: 0.5,
    easing: cubicOut
  }}"
  out:fade="{{ duration: 250 }}"
>
  <a href="{url}">
    <slot></slot>
  </a>
</li>