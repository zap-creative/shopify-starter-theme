const openCart = () => import(/* webpackChunkName: "app-cart" */ '../apps/cart').then((module) => {
  const Cart = module.default;
  
  Cart();
  return true;
}).catch(() => false);

export default openCart;
