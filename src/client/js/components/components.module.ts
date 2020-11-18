import WebComponent from "../base/web.component";
import EditPageComponent from "./edit-page/edit-page.component";
import AddPageComponent from "./add-page/add-page.component";
import DetailPageComponent from "./detail-page/detail-page.component";
import HomePageComponent from "./home-page/home-page.component";
import ToastComponent from "./toast/toast.component";
import TripCardComponent from "./trip-card/trip-card.component";
import TripDetailComponent from "./trip-detail/trip-detail.component";
import TripFormComponent from "./trip-form/trip-form.component";
import TripListComponent from "./trip-list/trip-list.component";

function registerComponents(...components: typeof WebComponent[]) {
  components.forEach(component => component.define());
}
export default () => registerComponents(
  ToastComponent,
  TripCardComponent,
  TripListComponent,
  HomePageComponent,
  DetailPageComponent,
  TripDetailComponent,
  TripFormComponent,
  AddPageComponent,
  EditPageComponent
);