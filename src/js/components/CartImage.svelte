<script>
  import { getSizedImageUrl } from "@shopify/theme-images";

  export let image;
</script>

<style>
  div {
    @apply w-20 h-20;

    align-items: center;
    background-color: rgba(var(--cn-c-primary--rgb, #ddd), 0.3);
    color: var(--cn-c-primary, #ddd);
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    overflow: hidden;
  }

  img {
    @apply w-32;

    max-width: none;
  }
</style>

{#if image.url}
  <div><img src={getSizedImageUrl(image.url, '132x')} alt={image.alt} /></div>
{:else}
  <div><i class="icon sz-48 material-icons-outlined">insert_photo</i></div>
{/if}
