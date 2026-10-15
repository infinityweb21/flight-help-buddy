import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainFilterComponent } from "../../../components/main-filter/main-filter.component";
import { SharedService } from "../../../services/shared/shared.service";
import{InnerpageTopCtaComponent} from "../../../components/innerpage-top-cta/innerpage-top-cta.component";

@Component({
  selector: "app-united-airlines-austin-to-washington-dc",
  imports: [CommonModule, MainFilterComponent,InnerpageTopCtaComponent],
  templateUrl: "./united-airlines-austin-to-washington-dc.component.html",
  styleUrl: "./united-airlines-austin-to-washington-dc.component.scss",
})
export class UnitedAirlinesAustinToWashingtonDcComponent {
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