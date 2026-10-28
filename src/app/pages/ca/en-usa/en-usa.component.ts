import { Component, inject } from '@angular/core';
import { SharedService } from '../../../services/shared/shared.service';

import { QuickContactComponent } from '../../../components/quick-contact/quick-contact.component';

@Component({
  selector: 'app-en-usa',
  imports: [QuickContactComponent],
  templateUrl: './en-usa.component.html',
  styleUrl: './en-usa.component.scss'
})
export class EnUsaComponent {
  private shareService: SharedService = inject(SharedService);
  getData: any = '';
  companyname: any = this.shareService.getcompanyName();

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
    this.companyname = this.getData.companyName;
  }
}