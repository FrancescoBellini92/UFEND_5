import TripService from './services/trip.service';
import HomePageComponent from './components/home-page/home-page.component';
import registerComponents from './components/components.module';
import factory from './base/factory';
import AddPageComponent from './components/add-page/add-page.component';
import { navigateTo } from './base/router';
import DetailPageComponent from './components/detail-page/detail-page.component';

registerComponents();

const tripService = factory.make<TripService>(TripService.injectionToken);

export default () => {

  const homePage = document.getElementById('home-page') as HomePageComponent;
  const addPage = document.getElementById('add-page') as AddPageComponent;

  const detailPage = document.getElementById('detail-page') as DetailPageComponent;

  function scrollOnTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function onNavigation() {
    const hash = window.location.hash;
    let navigationFn;
    switch (hash) {
      case '#add':
        navigationFn = () => {
          homePage.hide();
          detailPage.hide();
          addPage.show();
        };
        break;
      case '#detail':
        navigationFn = () => {
          if (!tripService.currentTrip) {
            navigateTo('');
            return;
          }
          homePage.hide();
          addPage.hide();
          detailPage.show();

        };
        break;
      case '#back':
        navigationFn = () => {
          window.history.back();
          window.history.back();
        }
        break;
      default:
        navigationFn = () => {
          addPage.hide();
          detailPage.hide( );
          homePage.show();
        };
    }
    navigationFn();
    scrollOnTop();
  }

  function initApp() {
    onNavigation();
  }

  window.addEventListener('hashchange', onNavigation);

  initApp();
}
