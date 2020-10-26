import AddPageComponent from "./add-page/add-page.component";
import HomePageComponent from "./home-page/home-page.component";
import TripCardComponent from "./trip-card/trip-card.component";
import TripFormComponent from "./trip-form/trip-form.component";
import TripListComponent from "./trip-list/trip-list.component";

export default function registerComponents() {
    TripCardComponent.define();
    HomePageComponent.define();
    TripFormComponent.define();
    AddPageComponent.define();
    TripListComponent.define();
  }