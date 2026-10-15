import { Component, inject } from '@angular/core';
import { SharedService } from '../../../services/shared/shared.service';

import { QuickContactComponent } from '../../../components/quick-contact/quick-contact.component';

@Component({
  selector: 'app-en-ca',
  imports: [QuickContactComponent],
  templateUrl: './en-ca.component.html',
  styleUrl: './en-ca.component.scss'
})
export class EnCaComponent {
  private shareService: SharedService = inject(SharedService);
  getData: any = '';
  companyname: any = this.shareService.getcompanyName();

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
    this.companyname = this.getData.companyName;
  }
}