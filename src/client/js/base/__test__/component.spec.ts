import { Component } from '../component';
import router from '../router';
import WebComponent from '../web.component';

describe('Component', () => {
  const mockSelector = 'mock-selector';
  const mockTemplate = 'mock-template';
  const mockStyle = {default: 'mock-style'};
  const mockRoute = 'mock-route';

  @Component({
    selector: mockSelector,
    template: mockTemplate,
    hasShadowDom: true,
    style: mockStyle,
    route: mockRoute
  })
  class MockComponent extends WebComponent {}
  MockComponent.define();

  let mockComponent: MockComponent;

  beforeEach(() => {
    mockComponent = new MockComponent();
  });

  it('has been decorated', () => {
    expect(MockComponent.selector).toEqual(mockSelector);
    expect(mockComponent.html).toEqual(mockTemplate);
    expect(mockComponent._style).toEqual(mockStyle);
    expect(mockComponent.hasShadowDom).toBeTruthy();
    expect(mockComponent.route).toEqual(mockRoute);
  });

  it('has registered route', () => {
    expect(router.routes.get(mockRoute)).toEqual(mockComponent);
  });
});
