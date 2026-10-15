import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-flight-payment-skeleton',
  imports: [SkeletonModule],
  templateUrl: './flight-payment-skeleton.component.html',
  styleUrl: './flight-payment-skeleton.component.scss'
})
export class FlightPaymentSkeletonComponent {
skeletonCount = 6;
skeletonlistCount = 6;
}
