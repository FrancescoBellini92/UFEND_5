export function addClass(className: string, ...elements: Element[]): void {
  elements.forEach((el) => el.classList.add(className));
}

export function removeClass(className: string, ...elements: Element[]): void {
  elements.forEach((el) => el.classList.remove(className));
}

export function show(...element: Element[]): void {
  removeClass('hidden', ...element);
  removeClass('open', ...element);
}

export function hide(...element: Element[]): void {
  addClass('hidden', ...element);
  removeClass('open', ...element);
}

export function inputNotValid(inputElement: HTMLInputElement): boolean {
  const value = inputElement.value;
  const trimmedValue = value ? value.trim() : value;
  return !trimmedValue;
}
