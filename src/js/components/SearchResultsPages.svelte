<script>
  import SearchResultsContainer from './SearchResultsContainer.svelte';
  import SearchResultHeading from './SearchResultHeading.svelte';
  import SearchResultItem from './SearchResultItem.svelte';
  import SearchResultDetail from './SearchResultDetail.svelte';

  export let pages = [];

  const {
    strings: {
      pages: headingTitle = "Pages",
    },
  } = window.theme;
</script>

<SearchResultsContainer>
  <SearchResultHeading id="pages" title="{headingTitle}" />
  <ul aria-labelledby="result-heading-pages" role="listbox" class="list row compact">
    {#each pages as page, i}
      <SearchResultItem title="{page.title}" url="{page.url}" index="{i}" wide>
        <SearchResultDetail>
          <h6 class="font-bold">{page.title}</h6>
          {#if page.body && page.body.length > 0}
            <p>
              {page.body
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