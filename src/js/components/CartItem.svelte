<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  import { formatMoney } from '@shopify/theme-currency';

  import { tFilterReplace } from '../utility/liquid-helpers';
  import CartImage from '../components/CartImage.svelte';

  export let product;
  const {
    numbers: {
      money_format = '${{value}}'
    },
    strings: {
      qty_value = '{{name}} quantity',
      qty_minus = 'decrease {{name}} quantity',
      qty_plus = 'increase {{name}} quantity',
      qty_remove = 'remove {{name}}',
    },
  } = window.theme;

  const dispatch = createEventDispatcher();
  const updateQty = (key, qty) => {
    dispatch('updateQty', { key, qty })
  };
</script>

<style>
  li {
    @apply py-4 border-b;

    align-items: stretch;
    border-color: var(--c-border);
    display: flex;
    flex: 1;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin: 0;
    width: 100%;
  }

  li:last-child {
    border-bottom: none;
  }

  .item-detail {
    @apply flex-1 pl-4 pr-6;
  }

  .item-qty {
    @apply space-y-2;

    display: flex;
    flex-flow: column nowrap;
    text-align: center;
  }

  .item-price {
    font-weight: var(--f-w-body--bold);
  }
</style>

<li transition:fly|local="{{ x: 100, duration: 300 }}">
  <a href={product.url} title="{product.title}">
    <CartImage bind:image="{product.featured_image}" />
  </a>
  <div class="item-detail">
    <a href={product.url}>{product.title}</a>
    <span class="block text-caps">{product.vendor}</span>
    {#if product.message}
      <div class="mt-1 prose-sm">{product.message}</div>
    {/if}
  </div>
  <div class="item-qty">
    <span class="item-price">{formatMoney(product.price, money_format)}</span>
    <div class="qty-wrapper">
      <button class="qty-increment" 
        role="button"
        aria-controls="item-{product.id}-qty"
        aria-label="{tFilterReplace(product.quantity === 1 ? qty_remove : qty_minus, {
          'name': product.title
        })}"
        on:click="{() => updateQty(product.key, product.quantity - 1)}"
      >
      {#if product.quantity === 1}
        <i class="material-icons-outlined qty-icon qty-icon-delete">delete</i>
      {:else}
        <i class="material-icons-outlined qty-icon">remove</i>
      {/if}
      </button>
      <div id="item-{product.id}-qty" 
        class="qty-count"
        aria-label="{tFilterReplace(qty_value, {
          'name': product.title
        })}"
      >
        {product.quantity}
      </div>
      <button class="qty-increment" 
        role="button"
        aria-controls="item-{product.id}-qty"
        aria-label="{tFilterReplace(qty_plus, {
          'name': product.title
        })}"
        on:click="{() => updateQty(product.key, product.quantity + 1)}"
      >
        <i class="material-icons-outlined qty-icon">add</i>
      </button>
    </div>
  </div>
</li>
