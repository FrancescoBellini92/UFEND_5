export function addClass(className: string, ...elements: Element[]): void {
  elements.forEach((el) => el.classList.add(className));
}

export function removeClass(className: string, ...elements: Element[]): void {
  elements.forEach((el) => el.classList.remove(className));
}

export function show(...elements: Element[]): void {
  removeClass('hidden', ...elements);
  removeClass('open', ...elements);
  addClass('visible', ...elements)
}

export function hide(...elements: Element[]): void {
  addClass('hidden', ...elements);
  removeClass('open', ...elements);
  removeClass('visible', ...elements)

}

export function inputNotValid(inputElement: HTMLInputElement): boolean {
  const value = inputElement.value;
  const trimmedValue = value ? value.trim() : value;
  return !trimmedValue;
}
