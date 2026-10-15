import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-hotel-list-skeleton',
  imports: [SkeletonModule],
  templateUrl: './hotel-list-skeleton.component.html',
  styleUrl: './hotel-list-skeleton.component.scss'
})
export class HotelListSkeletonComponent {
skeletonlistCount:number=10;
}
