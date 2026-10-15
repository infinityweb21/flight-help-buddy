import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-hotel-list',
  imports: [NgFor,RouterLink],
  templateUrl: './top-hotel-list.component.html',
  styleUrl: './top-hotel-list.component.scss'
})
export class TopHotelListComponent {
destinations: string[] = [
  'Bali', 'Dubai', 'Hong Kong', 'Rome', 'Venice',
];

destinationRouteMap: { [key: string]: string } = {
  'Bali': 'bali',
  'Dubai': 'dubai',
  'Hong Kong': 'hong-kong',
  'Rome': 'rome',
  
  'Venice': 'venice',
  
};

destinationRows: string[][] = [];

constructor() {
  this.chunkDestinations(7);
}

chunkDestinations(size: number): void {
  for (let i = 0; i < this.destinations.length; i += size) {
    this.destinationRows.push(this.destinations.slice(i, i + size));
  }
}

getRoute(destination: string): string {
  return '/hotel/' + (this.destinationRouteMap[destination] || '');
}
}