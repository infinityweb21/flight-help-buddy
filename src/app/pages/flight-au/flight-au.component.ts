import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

import { QuickContactComponent } from '../../components/quick-contact/quick-contact.component';

@Component({
  selector: 'app-flight-au',
  imports: [QuickContactComponent],
  templateUrl: './flight-au.component.html',
  styleUrl: './flight-au.component.scss'
})
export class FlightAuComponent {
  private shareService: SharedService = inject(SharedService);
  getData: any = '';
  companyname: any = this.shareService.getcompanyName();

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
    this.companyname = this.getData.companyName;
  }
}