import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
  OnDestroy,
  inject,
  DestroyRef,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainFilterComponent } from "../../components/main-filter/main-filter.component";
import { SharedService } from "../../services/shared/shared.service";
@Component({
  selector: 'app-routes',
  imports: [CommonModule, MainFilterComponent],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.scss'
})
export class RoutesComponent {
  getData: any;

  private shareService: SharedService = inject(SharedService);
  companyname: any = this.shareService.getcompanyName();
  flightContactNumber: string = "";
  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
    this.companyname = this.getData.companyName;
    this.flightContactNumber = this.getData.flightContactNumber;
  }
}
