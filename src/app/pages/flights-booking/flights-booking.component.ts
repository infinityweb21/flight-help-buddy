import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainFilterComponent } from "../../components/main-filter/main-filter.component";
import { SharedService } from "../../services/shared/shared.service";
import { InnerpageTopCtaComponent } from "../../components/innerpage-top-cta/innerpage-top-cta.component";
@Component({
  selector: "app-flights-booking",
  imports: [CommonModule, MainFilterComponent, InnerpageTopCtaComponent],
  templateUrl: "./flights-booking.component.html",
  styleUrl: "./flights-booking.component.scss",
})
export class FlightsBookingComponent {
  getData: any;

  private shareService: SharedService = inject(SharedService);
  companyname: any = this.shareService.getcompanyName();
  phoneNumber: any;
  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
    this.companyname = this.getData.companyName;
    this.phoneNumber = this.getData.phoneNumber;
  }
}
