import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

import { QuickContactComponent } from '../../components/quick-contact/quick-contact.component';

@Component({
  selector: 'app-flight-uk',
  imports: [QuickContactComponent],
  templateUrl: './flight-uk.component.html',
  styleUrl: './flight-uk.component.scss'
})
export class FlightUkComponent {
  private shareService: SharedService = inject(SharedService);
  getData: any = '';
  companyname: any = this.shareService.getcompanyName();

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
    this.companyname = this.getData.companyName;
  }
}