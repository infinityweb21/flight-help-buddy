import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

import { QuickContactComponent } from '../../components/quick-contact/quick-contact.component';
@Component({
  selector: 'app-cheap-flights',
  imports: [QuickContactComponent],
  templateUrl: './cheap-flights.component.html',
  styleUrl: './cheap-flights.component.scss'
})
export class CheapFlightsComponent {

  private shareService: SharedService = inject(SharedService);

  getData: any = '';

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
  }
}

