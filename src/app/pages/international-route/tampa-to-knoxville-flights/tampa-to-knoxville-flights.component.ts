import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainFilterComponent } from "../../../components/main-filter/main-filter.component";
import { SharedService } from "../../../services/shared/shared.service";
import{InnerpageTopCtaComponent} from "../../../components/innerpage-top-cta/innerpage-top-cta.component";

@Component({
  selector: "app-tampa-to-knoxville-flights",
  imports: [CommonModule, MainFilterComponent,InnerpageTopCtaComponent],
  templateUrl: "./tampa-to-knoxville-flights.component.html",
  styleUrl: "./tampa-to-knoxville-flights.component.scss",
})
export class TampaToKnoxvilleFlightsComponent {
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