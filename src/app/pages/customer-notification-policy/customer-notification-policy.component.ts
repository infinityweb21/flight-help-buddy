import { Component, inject, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-customer-notification-policy',
  imports: [],
  templateUrl: './customer-notification-policy.component.html',
  styleUrl: './customer-notification-policy.component.scss',
})
export class CustomerNotificationPolicyComponent {
  private shareService: SharedService = inject(SharedService);
  getData: any = '';

  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();
  }
}
