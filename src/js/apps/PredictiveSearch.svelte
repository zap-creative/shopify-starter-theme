<script>
  import { onMount } from 'svelte';
  import { fade, fly, slide } from 'svelte/transition';
  import { debounce, escape } from 'lodash-es';

  import PredictiveSearch from '@shopify/theme-predictive-search';
  import { trapFocus, removeTrapFocus } from '@shopify/theme-a11y';

  import { tFilterReplace } from '../utility/liquid-helpers';

  import SearchResultsProducts from '../components/SearchResultsProducts.svelte';
  import SearchResultsCollections from '../components/SearchResultsCollections.svelte';
  import SearchResultsArticles from '../components/SearchResultsArticles.svelte';
  import SearchResultsPages from '../components/SearchResultsPages.svelte';
  
  const body = document.body;
  const {
    settings: {
      predictiveSearchUri,
      predictiveSearchNumResults = 6,
      predictiveSearchShowProducts = true,
      predictiveSearchShowCollections = true,
      predictiveSearchShowPages = false,
      predictiveSearchShowArticles = false,
    },
    strings: {
      search_close = 'Close',
      search_clear = 'Clear search term',
      search_placeholder = 'Search',
      search_results_loading = 'Loading results',
      search_results_showing = {
        one: 'Showing {{results_count}} result',
        other: 'Showing {{results_count}} results',
        zero: 'No results found',
      },
      search_show_all = 'Show all results for &ldquo;{{term}}&rdquo; &#8594;',
      search_submit = 'Search',
      search_term_empty = 'Please enter a search term',
    },
  } = window.theme;

  const predictiveSearch = new PredictiveSearch({
    resources: {
      type: [
        predictiveSearchShowArticles ? PredictiveSearch.TYPES.ARTICLE : null,
        predictiveSearchShowCollections ? PredictiveSearch.TYPES.COLLECTION : null,
        predictiveSearchShowPages ? PredictiveSearch.TYPES.PAGE : null,
        predictiveSearchShowProducts ? PredictiveSearch.TYPES.PRODUCT : null
      ].filter((opt) => opt),
      limit: predictiveSearchNumResults,
      options: {
        unavailable_products: PredictiveSearch.UNAVAILABLE_PRODUCTS.LAST,
        fields: [
          PredictiveSearch.FIELDS.TITLE,
          PredictiveSearch.FIELDS.BODY,
          PredictiveSearch.FIELDS.VENDOR,
          PredictiveSearch.FIELDS.PRODUCT_TYPE,
          PredictiveSearch.FIELDS.VARIANTS_TITLE,
          PredictiveSearch.FIELDS.VARIANTS_SKU,
        ]
      }
    }
  });

  let loading = false;
  let open = false;
  let query = '';
  let results = {};

  $: num_results = Object.values(results).reduce((total, resultset) => {
    return total + resultset.length;
  }, 0);
  
  // Set success event listener
  predictiveSearch.on('success', suggestions => {
    results = suggestions.resources.results;
    loading = false;
  });

  // Set error event listener
  predictiveSearch.on('error', error => {
    console.error('Search error:', error.message);
    loading = false;
  });

  export function searchLoad() {
    open = true;
  }
  
  const focusSearch = () => {
    body.classList.add('overflow-hidden');

    const modal = document.getElementById('predictive-search-modal');
    trapFocus( modal, { 
      elementToFocus: modal.querySelector('[predictive-search-input]')
    });
  }

  const hideSearch = () => {
    open = false;

    body.classList.remove('overflow-hidden');
    removeTrapFocus();
  }

  const clearSearch = () => {
    query = '';
    results = {};
  }

  const handleKeydown = (e) => {
    if (e.keyCode === 27) hideSearch();
  }
  
  const handleChange = () => {
    if(query.length) {
      loading = true;
      
      predictiveSearch.query(query);
    } else {
      clearSearch();
    }
  }

  onMount(async () => searchLoad());
</script>

<style>
  .modal-overlay {
    justify-content: flex-start;
    padding-left: 0;
    padding-right: 0;
  }

  .modal-body {
    @apply max-h-36;

    border-radius: 0;
    max-width: none;
  }

  header {
    @apply max-w-3xl;

    align-self: center;
    width: 100%;
  }

  section {
    @apply max-w-3xl py-4;

    align-self: center;
    width: 100%;
  }

  .results-container {
    @apply shadow-md;

    align-items: stretch;
    background-color: var(--cn-modal-bg);
    display: flex;
    flex-flow: column nowrap;
    max-height: 480px;
    min-height: 64px;
    overflow-y: auto;
  }

  #predictive-search-results {
    @apply shadow-inner;

    align-items: stretch;
    display: flex;
    flex-flow: column nowrap;
    overflow-y: auto;
  }

  .search-for-button {
    @apply my-2;

    align-self: flex-start;
  }
</style>

<svelte:window on:keydown|once={handleKeydown}/>

{#if open}
  <div id="predictive-search-modal" class="modal open" in:focusSearch>
    <div class="modal-overlay" 
      in:fade="{{ duration: 300 }}" 
      out:fade="{{ duration: 300, delay: 200 }}" 
      on:click|self="{hideSearch}"
    >
      <div class="modal-body" 
        in:fly="{{ y: -200, duration: 300, delay: 200 }}"
        out:fly="{{ y: -200, duration: 300 }}"
      >
        
        <header>
          <span class="text-caps">Search</span>
          <button class="btn small is-ghost"
            aria-label="{search_close}"
            on:click="{hideSearch}"
          >
            <i class="icon material-icons-outlined">close</i>
          </button>
        </header>

        <section>
          <form action="{predictiveSearchUri}" method="get" role="search" on:reset="{clearSearch}">
            <div class="control has-icons-right has-icons-left">
              <input type="hidden" name="options[prefix]" value="last" aria-hidden="true" />
              <input type="search" name="q"
                placeholder="{search_placeholder}"
                spellcheck="false"
                autocorret="false"
                role="combobox"
                aria-autocomplete="list"
                aria-owns="predictive-search-results"
                aria-expanded="false"
                aria-label="{search_placeholder}"
                aria-haspopup="listbox"
                predictive-search-input
                class="input"
                bind:value="{query}"
                on:keydown="{handleKeydown}"
                on:input|preventDefault="{debounce(handleChange, 100)}"
              />
              <button type="reset" disabled="{query.length == 0}"
                class="btn is-ghost icon is-left"
                aria-label="{search_clear}"
              >
                <i class="material-icons-outlined">close</i>
              </button>
              <button type="submit" disabled="{query.length == 0}"
                class="btn is-ghost icon is-right"
                aria-label="{search_submit}"
              >
                <i class="material-icons-outlined">search</i>
              </button>
            </div>
            
            {#if open && query.length > 0}
              <div class="results-container {loading ? 'loading' : ''}" 
                in:slide="{{ y: -100, duration: 300, delay: loading ? 0 : 300 }}"
                out:slide="{{ y: -100, duration: 300 }}"
              >
                <div id="predictive-search-results">
                {#if results.products && results.products.length }
                  <SearchResultsProducts products={results.products} />
                {/if}
                {#if results.collections && results.collections.length }
                  <SearchResultsCollections collections={results.collections} />
                {/if}
                {#if results.articles && results.articles.length }
                  <SearchResultsArticles articles={results.articles} />
                {/if}
                {#if results.pages && results.pages.length }
                <SearchResultsPages pages={results.pages} />
                {/if}
                </div>
                <button type="submit" tabindex="-1" class="btn is-ghost search-for-button">
                  {@html tFilterReplace(search_show_all, {
                    'term': escape(query)
                  }, true)}
                </button>
              </div>
            {/if}

          </form>

          <p class="sr-only" aria-live="polite" aria-atomic="true" data-search-reader>
            {#if query.length > 0 && loading }
              { search_results_loading }
            {:else if query.length > 0}
              { tFilterReplace(search_results_showing, {
                'results_count': num_results
              })}
            {:else}
              { search_term_empty }
            {/if}
          </p>
        </section>

      </div>
    </div>
  </div>
{/if}
