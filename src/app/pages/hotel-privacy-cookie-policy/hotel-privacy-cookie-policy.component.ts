import { Component, inject, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-hotel-privacy-cookie-policy',
  imports: [],
  templateUrl: './hotel-privacy-cookie-policy.component.html',
  styleUrl: './hotel-privacy-cookie-policy.component.scss'
})
export class HotelPrivacyCookiePolicyComponent implements OnInit {
  companyData: any;
  private sharedService: SharedService = inject(SharedService);

  ngOnInit(): void {
    this.companyData = this.sharedService.getcompanyName();
  }
}
