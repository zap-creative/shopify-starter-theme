<script>
  import { formatMoney } from '@shopify/theme-currency';
  
  import SearchResultsContainer from './SearchResultsContainer.svelte';
  import SearchResultHeading from './SearchResultHeading.svelte';
  import SearchResultItem from './SearchResultItem.svelte';
  import SearchResultDetail from './SearchResultDetail.svelte';
  import SearchImage from './SearchImage.svelte';

  export let products = [];

  const {
    numbers: {
      money_format = '${{value}}',
    },
    settings: {
      searchShowProductVendor = false,
      searchShowProductPrice = false,
    },
    strings: {
      products: headingTitle = "Products",
    },
  } = window.theme;
</script>

<SearchResultsContainer>
  <SearchResultHeading id="products" title="{headingTitle}" />
  <ul aria-labelledby="result-heading-products" role="listbox" class="list row compact">
    {#each products as product, i}
      <SearchResultItem title="{product.title}" url="{product.url}" index="{i}">
        <SearchImage image="{product.featured_image}" type="product" />
        <SearchResultDetail>
          <h6 class="font-bold">
            {product.title}
            {#if searchShowProductVendor}
              <span class="block text-caps">{product.vendor}</span>
            {/if}
          </h6>
          {#if searchShowProductPrice}
            <p>{formatMoney(product.price, money_format)}</p>
          {/if}
        </SearchResultDetail>
      </SearchResultItem>
    {/each}
  </ul>
</SearchResultsContainer>