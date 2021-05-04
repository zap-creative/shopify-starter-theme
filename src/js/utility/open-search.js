const openSearch = () => import(/* webpackChunkName: "app-predictive-search" */ '../apps/predictive-search.js').then((module) => {
  const PredictiveSearch = module.default;
  PredictiveSearch();
  return true;
}).catch(() => false);

export default openSearch;
