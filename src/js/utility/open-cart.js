const openCart = () => {
  import(/* webpackChunkName: "app-cart-init" */ '../apps/app-cart-init').then((module) => {
    const appcart = module.default;
    appcart();
  });
};

export default openCart;
