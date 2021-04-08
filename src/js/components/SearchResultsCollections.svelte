<script>
  import SearchResultHeading from './SearchResultHeading.svelte';
  import SearchResultItem from './SearchResultItem.svelte';
  import CartImage from './CartImage.svelte';

  export let collections = [];
</script>

<div>
  <SearchResultHeading id="collections" title="{window.theme.strings.collections}" />
  <ul aria-labelledby="collections" role="listbox">
    {#each collections as collection, i}
      <SearchResultItem id="{collection.id}" url="{collection.url}" index="{i}">
        <CartImage image="{collection.featured_image}" />
        <p>{collection.title}</p>
      </SearchResultItem>
    {/each}
  </ul>
 </div>