import factory from '../factory';
import { Inject } from '../inject';
import { Injectable } from '../injectable';
import { Service } from '../service';

describe('Injectable', () => {
  const mockSingletonInjectionToken = 'mock-singleton-service';
  const mockInjectionToken = 'mock-service';

  @Injectable({
    injectionToken: mockSingletonInjectionToken,
    isSingleton: true
  })
  class MockSingletonService extends Service {
    static factoryFn = () => new MockSingletonService();
  }

  @Injectable({
    injectionToken: mockInjectionToken
  })
  class MockService extends Service {
    static factoryFn = () => new MockService();
  }

  @Inject({
      'injectionToken': MockSingletonService.injectionToken,
      'nameAsDependency': 'mockSingletonService'
    },
    {
      'injectionToken': MockService.injectionToken,
      'nameAsDependency': 'mockService'
  })
  class MockClient {
    mockSingletonService: MockSingletonService;
    mockService: MockService;
  }

  let mockSingletonService: MockSingletonService;
  let mockService: MockService;
  let mockClient: MockClient;

  beforeAll(() => {
    mockSingletonService = factory.make<MockSingletonService>(MockSingletonService.injectionToken);
    mockService = factory.make<MockService>(MockService.injectionToken);
    mockClient = new MockClient();
  });

  it('is decorated', () => {
    expect(MockSingletonService.injectionToken).toBe(mockSingletonInjectionToken);
    expect(mockSingletonService.isSingleton).toEqual(true);
    expect(factory.make<MockSingletonService>(MockSingletonService.injectionToken)).toBe(mockSingletonService);
  });

  it('is singleton', () => {
    expect(factory.make<MockSingletonService>(MockSingletonService.injectionToken)).toBe(mockSingletonService);
  });

  it('is not singleton', () => {
    expect(factory.make<MockService>(MockService.injectionToken)).not.toBe(mockService);
  });

  it('is injected', () => {
    expect(mockClient.mockSingletonService).toBe(mockSingletonService);
    expect(mockClient.mockService).toBeTruthy();
  });
});
