import registerComponents from './components/components.module';
import { navigateTo } from './base/router';

export default () => {
  registerComponents();
  navigateTo();
}