import PredictiveSearch from './PredictiveSearch.svelte';

export default () => {
  if (window.predictiveSearch) {
    window.predictiveSearch.searchLoad();
  } else {
    const search = new PredictiveSearch({
      target: document.getElementById('app-search'),
    });
    window.predictiveSearch = search;
  }
};
