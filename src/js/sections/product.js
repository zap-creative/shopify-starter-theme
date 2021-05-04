/**
 * Product specific scripts and styles
 */
import { ProductForm } from '@shopify/theme-product-form';
import { formatMoney } from '@shopify/theme-currency';
import { addItem } from '@shopify/theme-cart';
import { register } from '@shopify/theme-sections';

import '../utility/public-path';
import openCart from '../utility/open-cart';

const formElement = document.querySelector('[data-product-form]');
const addToCartBtn = document.querySelector('[data-add-to-cart]');
const featuredImage = document.querySelector('[data-featured-image]');
const stockMessages = document.querySelectorAll('[data-stock-message]');
const thumbnailLinks = document.querySelectorAll('[data-thumbnail-links]');

const {
  numbers: {
    money_format = '${{value}}',
  },
  settings: {
    ajaxEnabled = false,
  },
  strings: {
    add_to_cart = 'Add to cart',
    sold_out = 'Sold out',
    unavailable = 'Unavailable',
  },
} = window.theme;

register('product', {
  async onLoad() {
    this.handleThumbnailClick = this.handleThumbnailClick.bind(this);
    
    // Fetch the product data from the .js endpoint because it includes
    // more data than the .json endpoint. Alternatively, you could inline the output
    // of {{ product | json }} inside a <script> tag, with the downside that the
    // data can never be cached by the browser.
    //
    // You will need to polyfill `fetch()` if you want to support IE11
    fetch(`/products/${formElement.dataset.productHandle}.js`)
    .then((response) => response.json())
    .then((productJSON) => {
      this.productForm = new ProductForm(formElement, productJSON, {
        onOptionChange: this.handleOptionChange.bind(this),
        onFormSubmit: this.handleFormSubmit.bind(this),
      });
    });

    // Update featured image when you click on thumbnails
    if (thumbnailLinks) {
      thumbnailLinks.forEach((link) => {
        link.addEventListener('click', this.handleThumbnailClick);
      });
    }
  },

  onUnload() {
    this.productForm.destroy();

    // Remove event listeners
    if (thumbnailLinks) {
      thumbnailLinks.forEach((link) => {
        link.removeEventListener('click', this.handleThumbnailClick);
      });
    }
  },

  /**
   * Updating the featured image
   *
   * @param {string} imgSrc - Image src url
   * @param {string} imgAltText - Alt text for the image
   */
  handleThumbnailClick(event) {
    event.preventDefault();
    
    featuredImage.src = event.currentTarget.href;
    featuredImage.alt = event.target.alt;
    // Unset srcset as it overrides src
    featuredImage.srcset = '';
  },

  /**
   * ProductForm callbacks
   *
   * onOptionChange - Callback for whenever an option input changes
   * onQuantityChange - Callback for whenever an quantity input changes
   * onPropertyChange - Callback for whenever a property input changes
   * onFormSubmit - Callback for whenever the product form is submitted
   */
  handleOptionChange(event) {
    const { variant } = event.dataset;

    // Hide all stock message.
    stockMessages.forEach((stockMessage) => {
      stockMessage.classList.add('hidden');
      stockMessage.setAttribute('aria-hidden', true);
    });

    // Return and reset if we don't have a variant,
    if (!variant) {
      addToCartBtn.disabled = true;
      addToCartBtn.innerHTML = unavailable;
      return;
    }

    // Show stock message for this variant.
    let stockMessage = document.getElementById(`stock-message-${variant.id}`);
    if (stockMessage) {
      stockMessage.classList.remove('hidden');
      stockMessage.removeAttribute('aria-hidden');
    }

    // Update feature image
    if (variant.featured_image) {
      this.handleFeaturedImage(variant.featured_image.src, variant.featured_image.alt);
    }

    if (variant === null) {
      // The combination of selected options
      // does not have a matching variant
      addToCartBtn.disabled = true;
      addToCartBtn.innerHTML = unavailable;
    } else if (variant && !variant.available) {
      // The combination of selected options has
      // a matching variant but it is currently unavailable
      addToCartBtn.disabled = true;
      addToCartBtn.innerHTML = sold_out;
    } else if (variant && variant.available) {
      // The combination of selected options has
      // a matching variant and it is available
      addToCartBtn.disabled = false;
      addToCartBtn.innerHTML = `${add_to_cart} &middot; ${formatMoney(variant.price, money_format)}`;
    }
  },

  handleFormSubmit(event) {
    event.preventDefault();

    addToCartBtn.classList.add('loading');

    const { 
      variant: {
        id, 
      },
      properties,
      quantity,
    } = event.dataset;
    
    if(!ajaxEnabled) {
      formElement.submit();
      return;
    }

    addItem(id, { quantity, properties })
      .then(() => {
        addToCartBtn.classList.remove('loading');
        openCart().then((response) => {
          if (response === false) { window.location.href = '/cart'; }
        });
      })
      .catch(() => {
        addToCartBtn.classList.remove('loading');
        // Minimal error messages, so try standard form submit.
        formElement.submit();
      });
  }
});