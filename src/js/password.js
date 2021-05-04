/**
 * Scripts and styles used on the Password page
 */
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes';

import MicroModal from 'micromodal';

import { focusHash, bindInPageLinks, accessibleLinks } from '@shopify/theme-a11y';

import './utility/newsletter-subscribe';
import { handleLazyload } from './utility/lazyloaded';

/* Import SVG icons */
import facebook from '../assets/facebook.svg';
import instagram from '../assets/instagram.svg';
import pinterest from '../assets/pinterest.svg';
import snapchat from '../assets/snapchat.svg';
import tumblr from '../assets/tumblr.svg';
import twitter from '../assets/twitter.svg';
import vimeo from '../assets/vimeo.svg';
import youtube from '../assets/youtube.svg';

import '../css/password.scss';

const {
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

accessibleLinks('a[href]:not([aria-describedby])', {
  external: a11y_external,
  newWindow: a11y_new_window,
  newWindowExternal: a11y_new_window_external,
});
handleLazyload();

const modals = document.querySelectorAll('[data-micromodal]');
if(modals) {
  MicroModal.init({
    openTrigger: 'data-modal-open',
    closeTrigger: 'data-modal-close',
    awaitCloseAnimation: true,
  });
}
