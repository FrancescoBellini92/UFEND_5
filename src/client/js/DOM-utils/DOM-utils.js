export function $(selector) {
  return selector.includes('#') ? document.querySelector(selector) : document.querySelectorAll(selector);
}

export function addClass(className, ...elements) {
  elements.forEach((el) => el.classList.add(className));
}

export function removeClass(className, ...elements) {
  elements.forEach((el) => el.classList.remove(className));
}

export function show(element) {
  removeClass('hidden', element);
}

export function hide(element) {
  addClass('hidden', element);
}

export function inputNotValid(inputElement) {
  const value = inputElement.value;
  const trimmedValue = value ? value.trim() : value;
  return !trimmedValue;
}
