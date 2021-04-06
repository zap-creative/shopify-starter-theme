/**
 * Product specific scripts and styles
 */
import { ProductForm } from '@shopify/theme-product-form';
import { formatMoney } from '@shopify/theme-currency';
import { addItem } from '@shopify/theme-cart';

import '../css/product.css';
import './utility/public-path'; // Needed for openCart
import openCart from './utility/open-cart';

const themeStrings = window.theme.strings;
const themeMoneyFormat = window.theme.moneyFormat;

const formElements = document.querySelectorAll('[data-product-form]');

/**
 * Updating the featured image
 *
 * @param {string} imgSrc - Image src url
 * @param {string} imgAltText - Alt text for the image
 */
const handleFeaturedImage = (featuredImage) => (imgSrc, imgAltText) => {
  featuredImage.src = imgSrc;
  featuredImage.alt = imgAltText;
  // Unset srcset as it overrides src
  featuredImage.srcset = '';
}

/**
 * ProductForm callbacks
 *
 * handleOptionChange - Callback for whenever an option input changes
 * handleFormSubmit - Callback for whenever the product form is submitted
 */

const handleOptionChange = (stockMessages, addToCartBtn, featuredImage) => (event) => {
  const { variant } = event.dataset;

  // Hide all stock message.
  stockMessages.forEach((stockMessage) => stockMessage.classList.add('hidden'));

  // Return and reset if we don't have a variant,
  if (!variant) {
    addToCartBtn.disabled = true;
    addToCartBtn.innerHTML = themeStrings.unavailable;
    return;
  }

  // Show stock message for this variant.
  document.getElementById(`stock-message-${variant.id}`).classList.remove('hidden');

  // Update feature image
  if (variant.featured_image) {
    handleFeaturedImage(featuredImage)(variant.featured_image.src, variant.featured_image.alt);
  }

  if (variant === null) {
    // The combination of selected options does not have a matching variant
    addToCartBtn.disabled = true;
    addToCartBtn.innerHTML = themeStrings.unavailable;
  } else if (variant && !variant.available) {
    // The combination of selected options has a matching variant but it is currently unavailable
    addToCartBtn.disabled = true;
    addToCartBtn.innerHTML = themeStrings.soldOut;
  } else if (variant && variant.available) {
    // The combination of selected options has a matching variant and it is available
    addToCartBtn.disabled = false;
    addToCartBtn.innerHTML = `${themeStrings.addToCart} &middot; ${formatMoney(variant.price, themeMoneyFormat)}`;
  }
}

const handleFormSubmit = (addToCartBtn, formElement) => (event) => {
  event.preventDefault();

  addToCartBtn.classList.add('loading');

  const { id } = event.dataset.variant;
  const { quantity } = event.dataset;
  const { properties } = event.dataset;

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

formElements.forEach(formElement => {
  const addToCartBtn = formElement.querySelector('[data-add-to-cart]');
  const featuredImage = formElement.querySelector('[data-featured-image]');
  const stockMessages = formElement.querySelectorAll('[data-stock-message]');
  const thumbnailLinks = formElement.querySelectorAll('[data-thumbnail-links]');
  const productData = formElement.querySelector('[data-product-data]');

  // Update featured image when you click on thumbnails
  if (thumbnailLinks) {
    thumbnailLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        handleFeaturedImage(featuredImage)(event.currentTarget.href, event.target.alt);
      });
    });
  }

  Promise.resolve(productData.innerHTML)
    .then(JSON.parse)
    .then((product) => {
      new ProductForm(formElement, product, {
        onOptionChange: handleOptionChange(stockMessages, addToCartBtn, featuredImage),
        onFormSubmit: handleFormSubmit(addToCartBtn, formElement),
      });
    });
});
