import { load } from '@shopify/theme-sections';
import { wrapIframe } from './utility/rte';

import './sections/product';

import '../css/product.scss';

var iframeSelectors =
'iframe[src*="youtube.com/embed"],' +
'iframe[src*="player.vimeo"]'

wrapIframe({
  iframes: iframeSelectors,
  wrapper_class: 'video-wrapper'
});

load('*');