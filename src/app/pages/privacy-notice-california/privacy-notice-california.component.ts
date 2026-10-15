import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-privacy-notice-california',
  imports: [],
  templateUrl: './privacy-notice-california.component.html',
  styleUrl: './privacy-notice-california.component.scss',
})
export class PrivacyNoticeCaliforniaComponent {
  private sharedService: SharedService = inject(SharedService);
  getData: any;
  ngOnInit(): void {
    this.getData = this.sharedService.getcompanyName();

  }
}
