import { Component, inject } from '@angular/core';
import { SharedService } from '../../../services/shared/shared.service';

import { QuickContactComponent } from '../../../components/quick-contact/quick-contact.component';

@Component({
  selector: 'app-tickets',
  imports: [QuickContactComponent],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss'
})
export class TicketsComponent {
  private shareService: SharedService = inject(SharedService);
  getData: any = '';
  companyname: any = this.shareService.getcompanyName();

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
    this.companyname = this.getData.companyName;
  }
}