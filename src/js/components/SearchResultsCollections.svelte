<script>
  import SearchResultsContainer from './SearchResultsContainer.svelte';
  import SearchResultHeading from './SearchResultHeading.svelte';
  import SearchResultItem from './SearchResultItem.svelte';
  import SearchResultDetail from './SearchResultDetail.svelte';
  import CartImage from './CartImage.svelte';

  export let collections = [];
  
  const {
    strings: {
      collections: headingTitle = "Collections",
    },
  } = window.theme;
</script>

<SearchResultsContainer>
  <SearchResultHeading id="collections" title="{headingTitle}" />
  <ul aria-labelledby="result-heading-collections" role="listbox" class="list row compact">
    {#each collections as collection, i}
      <SearchResultItem title="{collection.title}" url="{collection.url}" index="{i}">
        <CartImage image="{collection.featured_image}" />
        <SearchResultDetail>
          <h6 class="font-bold">{collection.title}</h6>
          {#if collection.body && collection.body.length > 0}
            <p>
              {collection.body
                .replace(/(<([^>]+)>)/gi, '')
                .split(' ')
                .slice(0,20)
                .join(' ')} 
              [...]
            </p>
          {/if}
        </SearchResultDetail>
      </SearchResultItem>
    {/each}
  </ul>
</SearchResultsContainer>