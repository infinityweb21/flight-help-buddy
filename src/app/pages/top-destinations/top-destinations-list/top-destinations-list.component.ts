import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-destinations-list',
  imports: [NgFor,RouterLink],
  templateUrl: './top-destinations-list.component.html',
  styleUrl: './top-destinations-list.component.scss'
})
export class TopDestinationsListComponent {
//  destinations: string[] = [
//     'Istanbul', 'London', 'Madrid', 'Maldives', 'New York', 'Paris',
//     'Rome', 'Singapore', 'Switzerland', 'San Francisco', 'Los Angeles', 'Lake Tahoe',
//     'Santa Monica', 'Oregon', 'Seattle', 'St.george Utah', 'Death Valley National Park', 'Glacier National Park',
//     'Yosemite National Park', 'Martha Vineyard', 'Miami', 'Nashville, Tennessee', 'Philadelphia, Pennsylvania', 'Tampa',
//     'Charleston, South Carolina', 'Lake Placid, Ny', 'Acadia National Park', 'Great Smoky Mountains National Park', 'Savannah', 'Sedona, Arizona',
//     'Portland, Maine', 'Montpelier, Vermont', 'Finger Lakes', 'Massachusetts', 'Atlantic City', 'Manchester, New Hampshire',
//     'Washington Dc', 'Greenville, Sc', 'Montgomery', 'Athens', 'Victoria Island', 'Inuvik',
//     'Yellow Knife', 'Fort Smith', 'Tuktoyaktuk', 'Vancouver', 'Tofino', 'Calgary',
//     'Whistler', 'Jasper National Park', 'Churchill', 'Nova Scotia', 'Prince Edward Island', 'Lunenburg',
//     'Moncton', 'Hamilton', 'Toronto', 'Ottawa', 'Montreal', 'London, Ontario',
//     'Kitchener', 'Quebec City', 'Saskatoon', 'Drumheller', 'Regina', 'Breckenridge, Colorado',
//     'Girdwood, Alaska', 'Jackson Hole, Wyoming', 'Park City, Utah', 'Cancun, Mexico', 'Paris, Europe', 'Punta Cana',
//     'Alabama', 'California, Usa', 'Texas, United States', 'Banff, Alberta', 'Fernie, British Columbia', 'Okanagan Valley, Columbia',
//     'The Laurentians, Quebec', 'Abu Dhabi', 'India', 'Hong Kong, China', 'Sydney, Australia', 'Niagara Falls, Canada',
//     'Italy'
//   ];
destinations: string[] = [
  'New York', 'Paris',
  'Rome',  'Swiss Alps',
  'Bangkok', 'California, Usa', 'Florida', 'Sydney, Australia',
  'Tokyo',  'Kuala Lumpur'
];

destinationRouteMap: { [key: string]: string } = {
  'New York': 'new-york',
  'Paris': 'paris',
  'Rome': 'rome',
  'Swiss Alps': 'swis-alps',
  'Bangkok': 'bangkok',
  'California, Usa': 'california',
  'Florida': 'florida',
  'Sydney, Australia': 'sydney',
  'Tokyo': 'tokyo',
  'Kuala Lumpur': 'kuala-lumpur'
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
  return '/top-destinations/' + (this.destinationRouteMap[destination] || '');
}
}