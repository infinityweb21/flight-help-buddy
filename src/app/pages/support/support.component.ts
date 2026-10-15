import { Component, NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-support',
  imports: [],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss',
  schemas: [NO_ERRORS_SCHEMA]
})
export class SupportComponent {
  private shareService: SharedService = inject(SharedService);
  getData: any = '';

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
  }
}
