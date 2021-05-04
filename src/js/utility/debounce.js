const debounce = (fn) => {
  let raf;

  return (...args) => {
    if (raf) {
      return;
    }

    raf = window.requestAnimationFrame(() => {
      fn(...args);
      raf = undefined;
    });
  };
}

export default debounce;