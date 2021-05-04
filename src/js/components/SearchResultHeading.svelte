<script>
  export let id;
  export let title;
</script>

<style>
  h3 {
    @apply py-2 mb-2;

    border-bottom: 1px solid var(--c-border);
  }
</style>

<h3 id="result-heading-{id}" class="text-caps">{title}</h3>