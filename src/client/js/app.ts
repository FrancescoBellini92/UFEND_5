import registerComponents from './components/components.module';
import router from './base/router';
import factory from './base/factory';
import HeaderService from './services/header.service';

const headerService = factory.make<HeaderService>(HeaderService)

export default () => {
  registerComponents();
  router.addOnNavigationCallback((hash: string) => headerService.highlightNavigation(hash));
  router.initNavigation();
}