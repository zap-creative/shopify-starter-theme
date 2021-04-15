/**
 * Based on the prepareTransition by Jonathan Snook
 * Jonathan Snook - MIT License - https://github.com/snookca/prepareTransition
 **/
const prepareTransition = (element) => {
  element.addEventListener('transitionend',(event) => {
    event.currentTarget.classList.remove('is-transitioning');
  }, { once: true });
  
  let duration = 0;
  const properties = [
    'transition-duration',
    '-moz-transition-duration',
    '-webkit-transition-duration',
    '-o-transition-duration'
  ];

  const style = getComputedStyle(element);
  properties.forEach((property) => {
    const computedValue = style[property];

    if (computedValue) {
      computedValue.replace(/\D/g, '');
      duration || (duration = parseFloat(computedValue));
    }
  });

  if (duration !== 0) {
    element.classList.add('is-transitioning');
    element.offsetWidth;
  }
}

export default prepareTransition;