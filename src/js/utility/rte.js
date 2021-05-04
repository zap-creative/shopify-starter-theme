/**
 * Rich Text Editor
 * ---------------------------------------------
 * Wrap iframes and tables in div tags to force 
 * responsive/scrollable layout.
 *
 * modified from @shopify/theme-rte to remove
 * jQuery dependency. 
 */

/**
 * Wrap tables in a container div to make them scrollable when needed
 *
 * @param {object} options - Options to be used
 * @param {string} options.tables - selector query of tables to wrap
 * @param {string} options.wrapper_class - table wrapper class name
 */
 export const wrapTable = ({tables, wrapper_class = ''}) => {
  document.querySelectorAll(tables).forEach((el) => {
    let wrapper = document.createElement('div');
    wrapper.classList.add(wrapper_class);
    
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  });
}

/**
 * Wrap iframes in a container div to make them responsive
 *
 * @param {object} options - Options to be used
 * @param {string} options.iframes - selector query of iframes to wrap
 * @param {string} options.wrapper_class - class name used on the wrapping div
 */
export const wrapIframe = ({iframes, wrapper_class = ''}) => {
  document.querySelectorAll(iframes).forEach((el) => {
    let wrapper = document.createElement('div');
    wrapper.classList.add(wrapper_class);

    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    
    // Re-set the src attribute on each iframe after page load
    // for Chrome's "incorrect iFrame content on 'back'" bug.
    // https://code.google.com/p/chromium/issues/detail?id=395791
    // Need to specifically target video and admin bar
    el.src = el.src;
  });
}