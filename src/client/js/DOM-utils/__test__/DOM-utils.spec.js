import { $, addClass, removeClass, show, hide, inputNotValid } from '../DOM-utils';

describe('DOM utils functions', () => {
  let targetEl;

  beforeEach(() => {
    targetEl = document.createElement('input');
    targetEl.id = 'element-to-select';
    targetEl.classList.add('class-to-select');
    document.body.appendChild(targetEl);
  });

  afterEach(() => {
    document.innerHTML = '';
  });

  test('selects by id', () => {
    const selectedEl = $('#element-to-select');
    expect(selectedEl).toEqual(targetEl);
  });

  test('selects by class', () => {
    const selectedEl = $('.class-to-select').item(0);
    expect(selectedEl).toEqual(targetEl);
  });

  test('adds class', () => {
    addClass('added-class', targetEl);
    const classes = targetEl.classList;
    const hasClass = classes.contains('added-class');
    expect(hasClass).toBeTruthy();
  });

  test('removes class', () => {
    addClass('added-class', targetEl);
    removeClass('added-class', targetEl);
    const classes = targetEl.classList;
    const hasClass = classes.contains('added-class');
    expect(hasClass).toBeFalsy();
  });

  test('is hidden', () => {
    hide(targetEl);
    const classes = targetEl.classList;
    const hasClass = classes.contains('hidden');
    expect(hasClass).toBeTruthy();
  });

  test('is shown', () => {
    hide(targetEl);
    show(targetEl);
    const classes = targetEl.classList;
    const hasClass = classes.contains('hidden');
    expect(hasClass).toBeFalsy();
  });

  test('validates input', () => {
    expect(inputNotValid(targetEl)).toBeTruthy();

    targetEl.value = '';
    expect(inputNotValid(targetEl)).toBeTruthy();

    targetEl.value = ' ';
    expect(inputNotValid(targetEl)).toBeTruthy();

    targetEl.value = 'foo';
    expect(inputNotValid(targetEl)).toBeFalsy();
  });
});
