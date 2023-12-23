import factory from '../factory';
import { Inject } from '../inject';
import { Injectable } from '../injectable';

describe('Injectable', () => {

  @Injectable({
    isSingleton: true
  })
  class MockSingletonService {
    static factoryFn = () => new MockSingletonService();
  }

  @Injectable()
  class MockService {
    static factoryFn = () => new MockService();
  }

  @Inject({
      'injectionToken': MockSingletonService,
      'nameAsDependency': 'mockSingletonService'
    },
    {
      'injectionToken': MockService,
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
    mockSingletonService = factory.make<MockSingletonService>(MockSingletonService);
    mockService = factory.make<MockService>(MockService);
    mockClient = new MockClient();
  });

  it('is decorated', () => {
    expect(factory.make<MockSingletonService>(MockSingletonService)).toBe(mockSingletonService);
  });

  it('is singleton', () => {
    expect(factory.make<MockSingletonService>(MockSingletonService)).toBe(mockSingletonService);
  });

  it('is not singleton', () => {
    expect(factory.make<MockService>(MockService)).not.toBe(mockService);
  });

  it('is injected', () => {
    expect(mockClient.mockSingletonService).toBe(mockSingletonService);
    expect(mockClient.mockService).toBeTruthy();
  });
});
