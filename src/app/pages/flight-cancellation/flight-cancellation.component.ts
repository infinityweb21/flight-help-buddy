import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

import { QuickContactComponent } from '../../components/quick-contact/quick-contact.component';
@Component({
  selector: 'app-flight-cancellation',
  imports: [QuickContactComponent],
  templateUrl: './flight-cancellation.component.html',
  styleUrl: './flight-cancellation.component.scss'
})
export class FlightCancellationComponent {

  private shareService: SharedService = inject(SharedService);

  getData: any = '';

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
  }
}
