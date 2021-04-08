<script>
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  import PredictiveSearch from '@shopify/theme-predictive-search';
  import { trapFocus, removeTrapFocus } from '@shopify/theme-a11y';
  import { debounce, escape } from 'lodash-es';

  import SearchResultsProducts from '../components/SearchResultsProducts.svelte';
  import SearchResultsCollections from '../components/SearchResultsCollections.svelte';
  import SearchResultsArticles from '../components/SearchResultsArticles.svelte';
  import SearchResultsPages from '../components/SearchResultsPages.svelte';

  const predictiveSearch = new PredictiveSearch({
    resources: {
      type: [
        PredictiveSearch.TYPES.ARTICLE,
        PredictiveSearch.TYPES.COLLECTION,
        PredictiveSearch.TYPES.PAGE,
        PredictiveSearch.TYPES.PRODUCT
      ],
      limit: 6,
      options: {
        unavailable_products: PredictiveSearch.UNAVAILABLE_PRODUCTS.LAST,
        fields: [
          PredictiveSearch.FIELDS.TITLE,
          PredictiveSearch.FIELDS.BODY,
          PredictiveSearch.FIELDS.VENDOR,
          PredictiveSearch.FIELDS.PRODUCT_TYPE,
          PredictiveSearch.FIELDS.VARIANTS_TITLE
        ]
      }
    }
  });
  

  // Set success event listener
  predictiveSearch.on('success', suggestions => {
    results = suggestions.resources.results;
    num_results = Object.values(results).reduce((total, val) => total += val.length, 0);
    
    loading = false;
  });

  // Set error event listener
  predictiveSearch.on('error', error => {
    console.error('Search error:', error.message);
  });

  // props
  export let searchClose = 'Close';
  export let searchPlaceholder = 'Search';
  export let searchSubmit = 'Submit';
  export let searchUri;

  let loading = false;
  let num_results = 0;
  let query = '';
  let results = {};
  let showSearch = false;

  export function searchLoad() {
    showSearch = true;

    document.body.classList.add('overflow-hidden');
    // trapFocus(document.getElementById('search-modal'));
  }

  function hideSearch() {
    showSearch = false;
    
    document.body.classList.remove('overflow-hidden');
    removeTrapFocus();
  }

  function handleKeydown(e) {
    if (e.keyCode === 27) hideSearch();
  }
  
  function handleChange(e) {
    e.preventDefault();
    
    if(query.length) {
      loading = true;
      predictiveSearch.query(query);
    } else {
      results = {};
    }
  }

  onMount(async () => searchLoad());
</script>

<style>
  @layer components {
    .modal-bg {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
      
      background-color: rgba(var(--color-card-rgb), 0.8);
      backdrop-filter: blur(8px);
    }
    
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      z-index: 1000;
      
      transform: translate3d(-50%, -50%, 0);
    
      width: 100%;
      max-width: 500px;
    }

    button[data-search-close] {
      @apply flex flex-col items-center p-2;
    }

    input[type=text] {
      display: block;
      width: 100%;
    }

    input[type=text]:focus {
      border-color: var(--predictive-search-focus);
    }

    button[data-search-form-submit] {
      @apply flex flex-col items-center absolute p-2;

      top: 50%;
      right: 0;

      transform: translate3d(0, -50%, 0);
    }
    
    .predictive-search-results {
      @apply flex flex-col items-stretch py-2 shadow-md;

      max-height: 480px;
      overflow-y: scroll;

      background-color: var(--color-card);
    }
  }
</style>

<svelte:window on:keydown={handleKeydown}/>

{#if showSearch}
  <div class="modal-bg overflow-hidden" transition:fade="{{ duration: 250 }}" on:click={hideSearch} />

  <div id="search-modal" class="modal"
    data-search-form-container
    out:fade="{{ duration: 250 }}"
  >
    <div class="search-modal__actions">
      <button type="button" data-search-close on:click="{hideSearch}">
        <i class="material-icons-outlined">close</i>
        <span class="sr-only">{searchClose}</span>
      </button>
    </div>

    <form action="{searchUri}" method="get" role="search"
      in:scale="{{
        duration: 300,
        in: 1.0,
        out: 0.8,
        opacity: 0.5,
        easing: cubicOut
      }}"
    >
      <div class="relative">
        <input
          type="text"
          name="q"
          placeholder="{searchPlaceholder}"
          role="combobox"
          aria-autocomplete="list"
          aria-owns="predictive-search-results"
          aria-expanded="false"
          aria-label="{searchPlaceholder}"
          aria-haspopup="listbox"
          class="search-form__input"
          data-predictive-search-drawer-input
          bind:value="{query}"
          on:input="{debounce(handleChange, 100)}"
        />
        <input type="hidden" name="options[prefix]" value="last" aria-hidden="true" />
        <button type="submit" data-search-form-submit>
          <i class="material-icons-outlined">search</i>
          <span class="sr-only">{searchSubmit}</span>
        </button>
      </div>

      {#if num_results }
        <div class="predictive-search-results">
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
      {/if}

      {#if query.length }
        <button class="block p-2 font-bold" type="submit" tabindex="-1">
          {`${window.theme.strings.searchFor} ${escape(query)}`} &#8594;
        </button>
      {/if}
    </form>
  </div>
{/if}
