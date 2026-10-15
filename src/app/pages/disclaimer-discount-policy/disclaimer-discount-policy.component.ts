import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-disclaimer-discount-policy',
  imports: [],
  templateUrl: './disclaimer-discount-policy.component.html',
  styleUrl: './disclaimer-discount-policy.component.scss',
})
export class DisclaimerDiscountPolicyComponent {
  private sharedService: SharedService = inject(SharedService);
  getData: any;
  ngOnInit(): void {
    this.getData = this.sharedService.getcompanyName();
  }
}
