const selectors = {
  image: 'data-image',
  lazy_loaded: '.lazyloaded',
  offset: 'lazy-image-offset',
  wrapper: 'data-loading-animation'
};

const removeImageLoadingAnimation = (image) => {
  // Remove placeholder offset properties
  const offset = image.closest(selectors.offset);
  if(offset) {
    offset.style.removeProperty('padding-top');
    offset.style.removeProperty('max-height');
  }

  // Remove loading animation
  const wrapper = !image.hasAttribute(selectors.wrapper)
    ? image.closest(`[${selectors.wrapper}]`)
    : image;
  if (wrapper) {
    wrapper.removeAttribute(selectors.wrapper);
  }
}

// Remove loading animation from any lazyloaded images
// that have loaded before the event listener has been
// attached
const onLoadHideLazysizesAnimation = () => {
  const loaded = document.querySelectorAll(selectors.lazy_loaded);
  loaded.forEach((image) => {
    removeImageLoadingAnimation(image);
  });
}

export const handleLazyload = () => {
  document.addEventListener('lazyloaded', (event) => {
    const image = event.target;
    removeImageLoadingAnimation(image);
  
    if (!image.hasAttribute(selectors.image)) {
      return;
    }
  
    if (image.hasAttribute('data-bgset')) {
      const inner_image = image.querySelector(selectors.lazy_loaded);
      if (inner_image) {
        const alt = image.getAttribute('data-alt');
        const src = inner_image.hasAttribute('data-src')
          ? inner_image.getAttribute('data-src')
          : image.getAttribute('data-bg');
  
        image.setAttribute('alt', alt ? alt : '');
        image.setAttribute('src', src ? src : '');
      }
    }
  });

  onLoadHideLazysizesAnimation();
  // trigger scroll event to load in the correct resolution images
  window.dispatchEvent(new Event('scroll'));
};