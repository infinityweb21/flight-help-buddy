import { Component, inject } from '@angular/core';
import { SharedService } from '../../../services/shared/shared.service';

import { QuickContactComponent } from '../../../components/quick-contact/quick-contact.component';

@Component({
  selector: 'app-last-minute-flights',
  imports: [QuickContactComponent],
  templateUrl: './last-minute-flights.component.html',
  styleUrl: './last-minute-flights.component.scss'
})
export class LastMinuteFlightsComponent {
  private shareService: SharedService = inject(SharedService);
  getData: any = '';
  companyname: any = this.shareService.getcompanyName();

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
    this.companyname = this.getData.companyName;
  }
}