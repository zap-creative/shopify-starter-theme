/**
 * Product specific scripts and styles
 */
import { ProductForm } from '@shopify/theme-product-form';
import { formatMoney } from '@shopify/theme-currency';
import { addItem } from '@shopify/theme-cart';

import './utility/public-path';
import openCart from './utility/open-cart';

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

const products = document.querySelectorAll('[data-product]');

import '../css/product.scss';

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
 * onOptionChange - Callback for whenever an option input changes
 * onQuantityChange - Callback for whenever an quantity input changes
 * onPropertyChange - Callback for whenever a property input changes
 * onFormSubmit - Callback for whenever the product form is submitted
 */
const handleOptionChange = (stockMessages, addToCartBtn, featuredImage) => (event) => {
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
    handleFeaturedImage(featuredImage)(
      variant.featured_image.src, 
      variant.featured_image.alt
    );
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
}

const handleFormSubmit = (addToCartBtn, formElement) => (event) => {
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

products.forEach(product => {
  const formElement = product.querySelector('[data-product-form]');
  const addToCartBtn = product.querySelector('[data-add-to-cart]');
  const featuredImage = product.querySelector('[data-featured-image]');
  const stockMessages = product.querySelectorAll('[data-stock-message]');
  const thumbnailLinks = product.querySelectorAll('[data-thumbnail-links]');

  // We need to pull in option data separately since it's not included
  // in {{ product | json }} in our liquid template
  const productData = product.querySelector('[data-product-data]');
  const productOptionData = product.querySelector('[data-product-option-data]');
  
  const onOptionChange = handleOptionChange(stockMessages, addToCartBtn, featuredImage);
  const onFormSubmit = handleFormSubmit(addToCartBtn, formElement);
  const handleThumbnailClick = handleFeaturedImage(featuredImage);

  // Update featured image when you click on thumbnails
  if (thumbnailLinks) {
    thumbnailLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        handleThumbnailClick(event.currentTarget.href, event.target.alt);
      });
    });
  }


  Promise.all([
    Promise.resolve(productData.innerHTML),
    Promise.resolve(productOptionData.innerHTML)
  ]).then(([productData, productOptionData]) => {
    const productJSON = JSON.parse(productData);
    if (productOptionData !== null) {
      productJSON.options = JSON.parse(productOptionData);
    }

    const productForm = new ProductForm(formElement, productJSON, {
      onOptionChange, onFormSubmit,
    });
  });
});
