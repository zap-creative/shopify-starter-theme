import { register } from '@shopify/theme-sections';

import prepareTransition from '../utility/prepare-transition';
import debounce from '../utility/debounce';

const {
  breakpoints,
} = window.theme;

register('cart-section', {
  async onload() {
    this.Cart = new Cart();
  },

  onUnload() {
    this.Cart.unload();
  },
});

class Cart {
  constructor(){
    this.selectors = {
      cartCount: '[data-cart-count]',
      cartCountBubble: '[data-cart-count-bubble]',
      cartDiscount: '[data-cart-discount]',
      cartDiscountTitle: '[data-cart-discount-title]',
      cartDiscountAmount: '[data-cart-discount-amount]',
      cartDiscountWrapper: '[data-cart-discount-wrapper]',
      cartErrorMessage: '[data-cart-error-message]',
      cartErrorMessageWrapper: '[data-cart-error-message-wrapper]',
      cartItem: '[data-cart-item]',
      cartItemDetails: '[data-cart-item-details]',
      cartItemDiscount: '[data-cart-item-discount]',
      cartItemDiscountedPriceGroup: '[data-cart-item-discounted-price-group]',
      cartItemDiscountTitle: '[data-cart-item-discount-title]',
      cartItemDiscountAmount: '[data-cart-item-discount-amount]',
      cartItemDiscountList: '[data-cart-item-discount-list]',
      cartItemFinalPrice: '[data-cart-item-final-price]',
      cartItemImage: '[data-cart-item-image]',
      cartItemLinePrice: '[data-cart-item-line-price]',
      cartItemOriginalPrice: '[data-cart-item-original-price]',
      cartItemPrice: '[data-cart-item-price]',
      cartItemPriceList: '[data-cart-item-price-list]',
      cartItemProperty: '[data-cart-item-property]',
      cartItemPropertyName: '[data-cart-item-property-name]',
      cartItemPropertyValue: '[data-cart-item-property-value]',
      cartItemRegularPriceGroup: '[data-cart-item-regular-price-group]',
      cartItemRegularPrice: '[data-cart-item-regular-price]',
      cartItemTitle: '[data-cart-item-title]',
      cartItemOption: '[data-cart-item-option]',
      cartLineItems: '[data-cart-line-items]',
      cartNote: '[data-cart-notes]',
      cartQuantityErrorMessage: '[data-cart-quantity-error-message]',
      cartQuantityErrorMessageWrapper:
        '[data-cart-quantity-error-message-wrapper]',
      cartRemove: '[data-cart-remove]',
      cartStatus: '[data-cart-status]',
      cartSubtotal: '[data-cart-subtotal]',
      cartTotal: '[data-cart-total]',
      cartItemContent: '[data-cart-item-content]',
      cartWrapper: '[data-cart-wrapper]',
      emptyPageContent: '[data-empty-page-content]',
      quantityButton: '[data-quantity-button]',
      quantityInput: '[data-quantity-input]',
      quantityLabel: '[data-quantity-label]',
      inputQty: '[data-quantity-input]',
      thumbnails: '.cart-item__image',
      unitPrice: '[data-unit-price]',
      unitPriceBaseUnit: '[data-unit-price-base-unit]',
      unitPriceGroup: '[data-unit-price-group]'
    };
  
    this.classes = {
      cartNoCookies: 'cart--no-cookies',
      cartRemovedProduct: 'cart-item--removed',
      cartRemovedProductContent: 'card-content cart-item__removed-message',
      thumbnails: 'cart-item__image',
      hide: 'is-hidden',
      inputError: 'input--error'
    };
  
    this.attributes = {
      cartItemIndex: 'data-cart-item-index',
      cartItemKey: 'data-cart-item-key',
      cartItemQuantity: 'data-cart-item-quantity',
      cartItemTitle: 'data-cart-item-title',
      cartItemUrl: 'data-cart-item-url',
      quantityItem: 'data-quantity-item'
    };
  }
}