<script>
  import SearchResultHeading from './SearchResultHeading.svelte';
  import SearchResultItem from './SearchResultItem.svelte';

  export let pages = [];
</script>

<div>
  <SearchResultHeading id="pages" title="{window.theme.strings.pages}" />
  <ul aria-labelledby="pages" role="listbox">
    {#each pages as page, i}
      <SearchResultItem id="{page.id}" url="{page.url}" index="{i}">
        <p>{page.title}</p>
      </SearchResultItem>
    {/each}
  </ul>
 </div>