import { Component } from '@angular/core';
import { SkeletonModule } from "primeng/skeleton";

@Component({
  selector: 'app-hotel-details-skeleton',
  imports: [SkeletonModule],
  templateUrl: './hotel-details-skeleton.component.html',
  styleUrl: './hotel-details-skeleton.component.scss'
})
export class HotelDetailsSkeletonComponent {

}
