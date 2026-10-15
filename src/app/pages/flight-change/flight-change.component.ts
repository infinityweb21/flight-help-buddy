import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

import { QuickContactComponent } from '../../components/quick-contact/quick-contact.component';
@Component({
  selector: 'app-flight-change',
  imports: [QuickContactComponent],
  templateUrl: './flight-change.component.html',
  styleUrl: './flight-change.component.scss'
})
export class FlightChangeComponent {

  private shareService: SharedService = inject(SharedService);

  getData: any = '';

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
  }
}
