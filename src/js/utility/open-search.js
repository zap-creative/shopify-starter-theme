const openSearch = () => import(/* webpackChunkName: "predictive-search-init" */ '../apps/predictive-search-init').then((module) => {
  const predictiveSearch = module.default;
  predictiveSearch();
  return true;
}).catch(() => false);

export default openSearch;
