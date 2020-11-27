import registerComponents from './components/components.module';
import { navigateTo } from './base/router';
import router from './base/router';
import factory from './base/factory';
import HeaderService from './services/header.service';

const headerService = factory.make<HeaderService>(HeaderService.injectionToken)

export default () => {
  registerComponents();
  router.addOptionalFn((hash: string) => headerService.highlightNavigation(hash));
  navigateTo();
}