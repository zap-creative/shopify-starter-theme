import Cart from './Cart.svelte';

export default () => {
  if (window.cart) {
    window.cart.cartLoad();
  } else {
    const cart = new Cart({
      target: document.getElementById('app-cart'),
    });
    window.cart = cart;
  }
};
