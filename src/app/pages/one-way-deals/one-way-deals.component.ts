import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

import { QuickContactComponent } from '../../components/quick-contact/quick-contact.component';

@Component({
  selector: 'app-one-way-deals',
  imports: [QuickContactComponent],
  templateUrl: './one-way-deals.component.html',
  styleUrl: './one-way-deals.component.scss'
})
export class OneWayDealsComponent {

  private shareService: SharedService = inject(SharedService);

  getData: any = '';

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
  }
}