<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  import { trapFocus, removeTrapFocus } from '@shopify/theme-a11y';
  import { updateItem } from '@shopify/theme-cart';
  
  import CartItem from '../components/CartItem.svelte';
  import CartSummary from '../components/CartSummary.svelte';

  const {
    strings: {
      cart_checkout = 'Checkout',
      cart_close = 'Close',
      cart_empty = 'Wah, your cart is empty',
      cart_loading = 'Loading cart...',
      cart_title = 'Shopping Cart',
      cart_view = 'View Cart',
    },
  } = window.theme;

  let cartData = { 
    item_count: 0, 
    items: [],
  };

  let loading = false;
  let open = false;

  export function cartLoad() {
    open = true;
    loading = true;
    
    cartFetch().then((data) => {
      cartData = data;
      loading = false;
    });
  }

  const cartFetch = async () => {
    return fetch('/cart.js')
      .then((response) => response.json());
  }
  
  const focusCart = () => {
    document.body.classList.add('overflow-hidden');

    const modal = document.getElementById('cart-modal');
    trapFocus(modal, {
      elementToFocus: modal.querySelector('[data-modal-close]')
    });
  }

  const hideCart = () => {
    open = false;

    document.body.classList.remove('overflow-hidden');
    removeTrapFocus();
  }

  const handleUpdateQty = (e) => {
    loading = true;

    updateItem(e.detail.key, { quantity: e.detail.qty })
      .then((data) => {
        cartData = data;
        loading = false;
      });
  }

  const handleKeydown = (e) => {
    if (e.keyCode === 27) {
      hideCart();
    }
	}

  onMount(async () => cartLoad());
</script>

<style>
.modal-body {
  @apply max-w-lg;

  border-radius: 0;
  height: 100vh;
  padding: 0;
}

header,
section,
footer {
  @apply px-6;
}

header {
  @apply py-2;
}

section {
  @apply shadow-inner;

  display: flex;
  flex: 1;
  flex-flow: column nowrap;
  overflow-x: hidden;
  overflow-y: auto;
}

form {
  @apply mt-6;

  align-items: center;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}

footer {
  @apply py-6 border-t;
}
</style>

<svelte:window on:keydown|once="{handleKeydown}"/>

{#if open}
  <div id="cart-modal" class="modal open" in:focusCart>
    <div class="modal-overlay from-right overflow-hidden"
      in:fade="{{ duration: 300 }}"
      out:fade="{{ duration: 300, delay: 200 }}"
      on:click|self="{hideCart}"
    >
      <div class="modal-body"
        in:fly="{{ x: 100, duration: 500 }}"
        out:fly="{{ x: 300, duration: 300 }}"
      >

        <header>
          <span class="text-caps">{cart_title}</span>
          <button class="btn small is-ghost"
            aria-label="{cart_close}"
            on:click={hideCart}
            data-modal-close
          >
            <i class="icon material-icons-outlined">logout</i>
          </button>
        </header>

        <section class="{loading && !cartData.item_count ? 'loading' : ''}">
          {#if loading && !cartData.item_count}
            <div class="py-24 text-center">{cart_loading}</div>
          {:else if !cartData.item_count}
            <div class="py-24 text-center">{cart_empty}</div>
          {:else}
            <ul class="list compact">
              {#each cartData.items as product (product.id)}
                <CartItem on:updateQty="{handleUpdateQty}" {product} />
              {/each}
            </ul>
          {/if}
        </section>

        <footer class="{loading ? 'loading' : ''}">
          {#if cartData.item_count > 0}
            <CartSummary bind:cartData="{cartData}" />

            <form action="/cart" method="post">
              <a href="/cart" class="btn is-ghost">{cart_view}</a>
              <input type="submit" name="checkout" value="{cart_checkout}" class="btn is-primary" />
            </form>
          {/if}
        </footer>

      </div>
    </div>
  </div>
{/if}
