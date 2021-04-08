import { theme } from '../../../tailwind.config';
import PredictiveSearch from './PredictiveSearch.svelte';

export default () => {
  if (window.predictiveSearch) {
    window.predictiveSearch.searchLoad();
  } else {
    const el = document.getElementById('predictive-search');
    const predictiveSearch = new PredictiveSearch({
      target: el,
      props: {
        searchClose: el.getAttribute('data-search-close'),
        searchPlaceholder: el.getAttribute('data-search-placeholder'),
        searchSubmit: el.getAttribute('data-search-submit'),
        searchUri: el.getAttribute('data-search-uri'),
      }
    });

    window.predictiveSearch = predictiveSearch;
  }
};
