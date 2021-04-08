<script>
  import SearchResultHeading from './SearchResultHeading.svelte';
  import SearchResultItem from './SearchResultItem.svelte';

  export let articles = [];
</script>

<div>
  <SearchResultHeading id="articles" title="{window.theme.strings.articles}" />
  <ul aria-labelledby="articles" role="listbox">
    {#each articles as article, i}
      <SearchResultItem id="{article.id}" url="{article.url}" index="{i}">
        <p>{article.title}</p>
      </SearchResultItem>
    {/each}
  </ul>
 </div>