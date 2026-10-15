import {
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { Destination } from '../../../core/models/destination.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { MainFilterComponent } from "../../../components/main-filter/main-filter.component";
import { Router, RouterLink } from '@angular/router';
import { CallCtaComponent } from '../../../components/call-cta/call-cta.component';

@Component({
  selector: "app-hero",
  imports: [
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    MainFilterComponent,
    RouterLink,CallCtaComponent
  ],
  templateUrl: "./hero.component.html",
  styleUrl: "./hero.component.scss",
})
export class HeroComponent {
  destinations: Destination[] = [];
  private router: Router = inject(Router);
  ishome: boolean = true;
  vactionResponsiveOptions: any[] | undefined;

  ngOnInit() {
    const currentUrl = this.router.url;
const currentPath = this.router.url.split('?')[0];    // Example: Check if it's the home page
this.ishome = currentPath === '/' || currentPath === '/home';
    this.destinations = [
      {
        id: 1,
        name: "New York City, USA",
        route: "/top-destinations/new-york", // new route
        image: "assets/images/home/destination-img-1.webp",
        flights: 10,
        hotels: 10,
        cruises: 10,
      },
      {
        id: 2,
        name: "Bangkok, Thailand",
        route: "/top-destinations/bangkok",
        image: "assets/images/home/destination-img-2.webp",
        flights: 10,
        hotels: 10,
        cruises: 10,
      },
      {
        id: 3,
        name: "Sydney, Australia",
        route: "/top-destinations/sydney",
        image: "assets/images/home/destination-img-3.webp",
        flights: 10,
        hotels: 10,
        cruises: 10,
      },
      {
        id: 4,
        name: "Kuala Lumpur, Malaysia",
        route: "/top-destinations/kuala-lumpur",
        image: "assets/images/home/destination-img-4.webp",
        flights: 10,
        hotels: 10,
        cruises: 10,
      },
      // {
      //   id: 5,
      //   name: 'Zurich, Switzerland',
      //   route: '/top-destinations/zurich',
      //   image: 'assets/images/home/destination-img-5.webp',
      //   flights: 21,
      //   hotels: 15,
      //   cruises: 6,
      // },
      {
        id: 6,
        name: "Paris, France",
        route: "/top-destinations/paris",
        image: "assets/images/home/destination-img-6.webp",
        flights: 10,
        hotels: 10,
        cruises: 10,
      },
      {
        id: 7,
        name: "Tokyo, Japan",
        route: "/top-destinations/tokyo",
        image: "assets/images/home/destination-img-7.webp",
        flights: 10,
        hotels: 10,
        cruises: 10,
      },
      {
        id: 8,
        name: "Amsterdam, Netherlands",
        route: "/top-destinations/amsterdam",
        image: "assets/images/home/destination-img-8.webp",
        flights: 10,
        hotels: 10,
        cruises: 10,
      },
    ];
    this.vactionResponsiveOptions = [
      {
        breakpoint: "1400px",
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: "1199px",
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: "767px",
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }
}
