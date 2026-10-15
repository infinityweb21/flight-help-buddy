import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

import { QuickContactComponent } from '../../components/quick-contact/quick-contact.component';

@Component({
  selector: 'app-international-flights',
  imports: [QuickContactComponent],
  templateUrl: './international-flights.component.html',
  styleUrl: './international-flights.component.scss'
})
export class InternationalFlightsComponent {

  private shareService: SharedService = inject(SharedService);

  getData: any = '';

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
  }
}