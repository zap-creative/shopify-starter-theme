<script>
  import { getSizedImageUrl } from "@shopify/theme-images";

  export let image;
  export let type = 'product';

  const image_types = {
    ARTICLE: 'article',
    COLLECTION: 'collection',
    PAGE: 'page',
    PRODUCT: 'product',
  }
</script>

<style>
  div {
    @apply w-20 h-20 my-2 rounded-sm;

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
  <div>
    {#if type === image_types.ARTICLE }
      <i class="icon sz-48 material-icons-outlined">article</i>
    {:else if type === image_types.COLLECTION }
      <i class="icon sz-48 material-icons-outlined">insert_photo</i>
    {:else if type === image_types.PAGE }
      <i class="icon sz-48 material-icons-outlined">description</i>
    {:else if type === image_types.PRODUCT }
      <i class="icon sz-48 material-icons-outlined">insert_photo</i>
    {/if}
  </div>
{/if}
