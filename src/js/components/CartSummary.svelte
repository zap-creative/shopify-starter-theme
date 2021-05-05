<script>
  import { formatMoney } from '@shopify/theme-currency';
  import { tFilterReplace } from '../utility/liquid-helpers';

  export let cartData;
  
  const discount_types = {
    PERCENTAGE: 'percentage',
    AMOUNT: 'amount',
  };

  const {
    numbers: {
      money_format = '${{amount}}',
      money_off = '{{value}} off',
      percent_off = '{{value}}% off',
    },
    strings: {
      cart_order_discount = 'Cart Discount',
      cart_subtotal = 'Subtotal',
      cart_total = 'Total',
    },
  } = window.theme;
</script>

<style>
  table {
    width: 100%;
  }

  tfoot {
    border-top: 1px solid var(--cn-border-dark);
  }

  tr {
    display: flex;
    flex-flow: row nowrap;
    min-width: 100%;
  }

  th,
  td {
    @apply py-1;

    align-items: center;
    display: inline-flex;
    flex-flow: row nowrap;
  }

  th {
    @apply space-x-2;

    justify-content: flex-start;
  }

  td {
    flex: 1;
    justify-content: flex-end;
  }

  .tags {
    margin-bottom: 0;
    text-transform: uppercase;
  }

  .tag {
    margin-bottom: 0;
  }
</style>

<table class="table wide is-ghost summary-table">
  {#if cartData.cart_level_discount_applications.length }
    <tbody class="cart-subtotal">
      <tr>
        <th id="cart-subtotal" scope="row">{cart_subtotal}</th>
        <td aria-describedby="#cart-subtotal">
          {formatMoney(cartData.original_total_price, money_format)}
        </td>
      </tr>
    </tbody>

    <tbody class="cart-discounts">
      {#each cartData.cart_level_discount_applications as discount, i}
        <tr>
          <th class="font-normal" scope="row">
            <span class="tags normal has-addons" aria-label="{cart_order_discount}">
              <span class="tag is-black"><i class="icon sz-16 material-icons">sell</i></span>
              <span class="tag is-black is-light text-caps">
                {#if discount.value_type == discount_types.PERCENTAGE}
                  {tFilterReplace(percent_off, {
                    'value': Math.round(discount.value)
                  })}
                {:else if discount.value_type == discount_types.AMOUNT}
                  {tFilterReplace(money_off, {
                    'value': formatMoney(discount.value, money_format)
                  })}
                {/if}
              </span>
            </span>
            <span id="#cart-discount-{i}">{discount.title}</span>
          </th>
          <td aria-describedby="#cart-discount-{i}">
            (-{formatMoney(discount.total_allocated_amount, money_format)})
          </td>
        </tr>
      {/each}
    </tbody>
  {/if}

  <tfoot>
    <tr>
      <th id="cart-total" scope="row">{cart_total}</th>
      <td aria-describedby="#cart-total">
        {formatMoney(cartData.total_price, money_format)}
      </td>
    </tr>
  </tfoot>
</table>