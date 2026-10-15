import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

import { QuickContactComponent } from '../../components/quick-contact/quick-contact.component';

@Component({
  selector: 'app-round-trip-deals',
  imports: [QuickContactComponent],
  templateUrl: './round-trip-deals.component.html',
  styleUrl: './round-trip-deals.component.scss'
})
export class RoundTripDealsComponent {

  private shareService: SharedService = inject(SharedService);

  getData: any = '';

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
  }
}