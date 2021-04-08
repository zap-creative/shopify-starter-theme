<script>
  import SearchResultHeading from './SearchResultHeading.svelte';
  import SearchResultItem from './SearchResultItem.svelte';
  import CartImage from './CartImage.svelte';

  export let products = [];
</script>

<div>
  <SearchResultHeading id="products" title="{window.theme.strings.products}" />
  <ul aria-labelledby="products" role="listbox">
    {#each products as product, i}
      <SearchResultItem id="{product.id}" url="{product.url}" index="{i}">
        <CartImage image="{product.featured_image}" />
        <p>{product.title}</p>
      </SearchResultItem>
    {/each}
  </ul>
 </div>