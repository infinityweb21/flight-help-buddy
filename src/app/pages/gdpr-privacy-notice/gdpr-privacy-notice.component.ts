import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-gdpr-privacy-notice',
  imports: [],
  templateUrl: './gdpr-privacy-notice.component.html',
  styleUrl: './gdpr-privacy-notice.component.scss',
})

export class GdprPrivacyNoticeComponent {
  private sharedService: SharedService = inject(SharedService);
  getData: any;
  ngOnInit(): void {
    this.getData = this.sharedService.getcompanyName();
  }
}
