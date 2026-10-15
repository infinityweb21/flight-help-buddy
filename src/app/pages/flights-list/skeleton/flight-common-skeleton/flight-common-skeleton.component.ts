import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-flight-common-skeleton',
  imports: [SkeletonModule],
  templateUrl: './flight-common-skeleton.component.html',
  styleUrl: './flight-common-skeleton.component.scss'
})
export class FlightCommonSkeletonComponent {
skeletonCount = 15;
skeletonlistCount = 15;
}
