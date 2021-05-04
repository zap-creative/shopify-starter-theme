<script>
  import SearchResultsContainer from './SearchResultsContainer.svelte';
  import SearchResultHeading from './SearchResultHeading.svelte';
  import SearchResultItem from './SearchResultItem.svelte';
  import SearchResultDetail from './SearchResultDetail.svelte';
  import SearchImage from './SearchImage.svelte';

  export let articles = [];

  const {
    strings: {
      articles: headingTitle = "Articles",
    },
  } = window.theme;
</script>

<SearchResultsContainer>
  <SearchResultHeading id="articles" title="{headingTitle}" />
  <ul aria-labelledby="result-heading-articles" role="listbox" class="list row compact">
    {#each articles as article, i}
      <SearchResultItem title="{article.title}" url="{article.url}" index="{i}" wide>
        <SearchImage image="{article.featured_image}" type="article" />
        <SearchResultDetail>
          <h6 class="font-bold">{article.title}</h6>
          {#if article.summary_html && article.summary_html.length > 0}
            {article.summary_html
              .replace(/(<([^>]+)>)/gi, '')
              .split(' ')
              .slice(0, 20)
              .join(' ')} 
            [...]
          {/if}
        </SearchResultDetail>
      </SearchResultItem>
    {/each}
  </ul>
</SearchResultsContainer>