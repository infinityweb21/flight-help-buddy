import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainFilterComponent } from "../../components/main-filter/main-filter.component";
import { SharedService } from "../../services/shared/shared.service";
import{InnerpageTopCtaComponent} from "../../components/innerpage-top-cta/innerpage-top-cta.component";

@Component({
  selector: "app-airlines",
  imports: [CommonModule, MainFilterComponent,InnerpageTopCtaComponent],
  templateUrl: "./airlines.component.html",
  styleUrl: "./airlines.component.scss",
})
export class AirlinesComponent {
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