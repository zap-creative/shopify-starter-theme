/**
 * Scripts and styles used globally
 */
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes';

import { focusHash, bindInPageLinks } from '@shopify/theme-a11y';
import { load } from '@shopify/theme-sections';

import './sections/site-header';

import './utility/public-path';
import './utility/newsletter-subscribe';

import openCart from './utility/open-cart';
import openSearch from './utility/open-search';

const themeSettings = window.theme.settings;

import '../css/theme.scss';

// Common a11y fixes
bindInPageLinks();
if (window.location.hash) {
  focusHash();
}

// Apply a specific class to the html element for browser support of cookies.
if (navigator.cookieEnabled) {
  document.documentElement.classList.replace(
    'supports-no-cookies',
    'supports-cookies',
  );
}

// Load predictive search
const searchLinks = document.querySelectorAll('.open-search');
if (searchLinks && themeSettings.predictiveSearchEnabled) {
  searchLinks.forEach((searchLink) => {
    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch().then((res) => {
        if (res === false) {
          window.location.href = e.currentTarget.getAttribute('href');
        }
      });
    });
  });
}

// Handle cart sidebar component
const cartLinks = document.querySelectorAll('.open-cart');
if (cartLinks && themeSettings.ajaxEnabled) {
  cartLinks.forEach((cartLink) => {
    cartLink.addEventListener('click', (e) => {
      e.preventDefault();
      openCart().then((res) => {
        if (res === false) {
          window.location.href = e.currentTarget.getAttribute('href');
        }
      });
    });
  });
}

load('*');
