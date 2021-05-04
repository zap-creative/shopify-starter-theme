/**
 * Based on the prepareTransition by Jonathan Snook
 * Jonathan Snook - MIT License - https://github.com/snookca/prepareTransition
 **/
const prepareTransition = (element, animation = false) => {
  const type = animation ? 'animation' : 'transition';

  element.addEventListener(`${type}end`,(event) => {
    event.currentTarget.classList.remove(animation 
      ? 'animating' 
      : 'transitioning'
    );
  }, { once: true });
  
  let duration = 0;
  const properties = [
    `${type}-duration`,
    `-moz-${type}-duration`,
    `-webkit-${type}-duration`,
    `-o-${type}-duration`
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
    element.classList.add(animation 
      ? 'animating' 
      : 'transitioning'
    );
    element.offsetWidth;
  }
}

export default prepareTransition;