import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainFilterComponent } from "../../../components/main-filter/main-filter.component";
import { SharedService } from "../../../services/shared/shared.service";
import{InnerpageTopCtaComponent} from "../../../components/innerpage-top-cta/innerpage-top-cta.component";

@Component({
  selector: "app-american-airlines-los-angeles-to-atlanta",
  imports: [CommonModule, MainFilterComponent,InnerpageTopCtaComponent],
  templateUrl: "./american-airlines-los-angeles-to-atlanta.component.html",
  styleUrl: "./american-airlines-los-angeles-to-atlanta.component.scss",
})
export class AmericanAirlinesLosAngelesToAtlantaComponent {
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