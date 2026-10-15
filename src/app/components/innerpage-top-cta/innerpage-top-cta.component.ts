import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedService } from "../../services/shared/shared.service";

@Component({
  selector: "app-innerpage-top-cta",
  imports: [CommonModule],
  templateUrl: "./innerpage-top-cta.component.html",
  styleUrl: "./innerpage-top-cta.component.scss",
})
export class InnerpageTopCtaComponent {
  getData: any;

  private shareService: SharedService = inject(SharedService);

  companyname: any = this.shareService.getcompanyName();

  phoneNumber: string = "";

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();

    this.companyname = this.getData.companyName;

    this.phoneNumber = this.getData.phoneNumber;
  }
}