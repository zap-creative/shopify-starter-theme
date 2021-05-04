/**
 * Scripts and styles used globally
 */
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes';

import { focusHash, bindInPageLinks, accessibleLinks } from '@shopify/theme-a11y';
import { load } from '@shopify/theme-sections';

import './sections/site-header';

import './utility/public-path';
import './utility/newsletter-subscribe';
import { handleLazyload } from './utility/lazyloaded';

import openCart from './utility/open-cart';
import openSearch from './utility/open-search';

/* Import SVG icons */
import facebook from '../assets/facebook.svg';
import instagram from '../assets/instagram.svg';
import pinterest from '../assets/pinterest.svg';
import snapchat from '../assets/snapchat.svg';
import tumblr from '../assets/tumblr.svg';
import twitter from '../assets/twitter.svg';
import vimeo from '../assets/vimeo.svg';
import youtube from '../assets/youtube.svg';

import '../css/theme.scss';

const {
  settings: {
    ajaxEnabled = true,
    predictiveSearchEnabled = true,
  },
  strings: {
    a11y_external,
    a11y_new_window,
    a11y_new_window_external,
  },
} = window.theme;

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

// Load predictive search component
const searchLinks = document.querySelectorAll('.open-search');
if (searchLinks && predictiveSearchEnabled) {
  searchLinks.forEach((searchLink) => {
    searchLink.addEventListener('click', (e) => {
      e.preventDefault();

      const target = e.currentTarget;
      openSearch().then((res) => {
        if (res === false) {
          window.location.href = target.getAttribute('href');
        }
      });
    });
  });
}

// Load dynamic cart component
const cartLinks = document.querySelectorAll('.open-cart');
if (cartLinks && ajaxEnabled) {
  cartLinks.forEach((cartLink) => {
    cartLink.addEventListener('click', (e) => {
      e.preventDefault();

      const target = e.currentTarget;
      openCart().then((res) => {
        if (res === false) {
          window.location.href = target.getAttribute('href');
        }
      });
    });
  });
}

document.querySelectorAll('a[href="#"]').forEach((el) => {
  el.addEventListener('click', (evt) => {
    evt.preventDefault();
  });
});

accessibleLinks('a[href]:not([aria-describedby])', {
  external: a11y_external,
  newWindow: a11y_new_window,
  newWindowExternal: a11y_new_window_external,
});
handleLazyload();

load('*');