import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainFilterComponent } from "../../../components/main-filter/main-filter.component";
import { SharedService } from "../../../services/shared/shared.service";
import{InnerpageTopCtaComponent} from "../../../components/innerpage-top-cta/innerpage-top-cta.component";

@Component({
  selector: "app-united-airlines-los-angeles-to-orlando",
  imports: [CommonModule, MainFilterComponent,InnerpageTopCtaComponent],
  templateUrl:
    "./united-airlines-los-angeles-to-orlando.component.html",
  styleUrl: "./united-airlines-los-angeles-to-orlando.component.scss",
})
export class UnitedAirlinesLosAngelesToOrlandoComponent {
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