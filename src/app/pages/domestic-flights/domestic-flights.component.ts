import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

import { QuickContactComponent } from '../../components/quick-contact/quick-contact.component';

@Component({
  selector: 'app-domestic-flights',
  imports: [QuickContactComponent],
  templateUrl: './domestic-flights.component.html',
  styleUrl: './domestic-flights.component.scss'
})
export class DomesticFlightsComponent {

  private shareService: SharedService = inject(SharedService);

  getData: any = '';

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
  }
}