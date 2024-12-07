import registerComponents from './components/components.module';
import router from './base/router';
import factory from './base/factory';
import HeaderService from './services/header.service';
import { getFirebase } from '../../firebase';



const headerService = factory.make<HeaderService>(HeaderService.injectionToken)

export default () => {
  getFirebase();
  registerComponents();
  router.addOnNavigationCallback((hash: string) => headerService.highlightNavigation(hash));
  router.initNavigation();
}