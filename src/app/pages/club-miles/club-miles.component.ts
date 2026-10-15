import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';
import { RouterLink } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-club-miles',
  imports: [RouterLink],
  templateUrl: './club-miles.component.html',
  styleUrl: './club-miles.component.scss'
})
export class ClubMilesComponent {

private sharedService:SharedService=inject(SharedService)
public companyname:any


partners = [
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/IATA_logo.svg',
    alt: 'IATA'
  },
  {
    image: 'https://www2.arccorp.com/globalassets/about-us/arc_logo_blue.png',
    alt: 'ARC'
  },
  {
    image: 'https://www.asta.org/Resources/Images/logo.png',
    alt: 'ASTA'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/NortonLifeLock_logo.svg',
    alt: 'Norton'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/McAfee_logo.svg',
    alt: 'McAfee'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    alt: 'MasterCard'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg',
    alt: 'Visa'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Amex_logo.svg',
    alt: 'American Express'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Discover_Card_logo.svg',
    alt: 'Discover'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Diners_Club_Logo.svg',
    alt: 'Diners Club'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/30/PayPal_Logo_2014.svg',
    alt: 'PayPal'
  },
  {
    image: 'https://1000logos.net/wp-content/uploads/2023/02/Affirm-Logo.png',
    alt: 'Affirm'
  },
  {
    image: 'https://accruesavings.com/logo.png',
    alt: 'Accrue Savings'
  }
];
ngAfterViewInit(): void {
    $('.partner-slider').owlCarousel({
      items: 5,
      loop: true,
      autoplay: true,
      autoplayTimeout: 2000,
      smartSpeed: 800,
      dots: false,
      nav: false,
      responsive: {
        0: { items: 2 },
        600: { items: 6 },
        1000: { items: 8 }
      }
    });
  }
  

  ngOnInit(){
   this.companyname= this.sharedService.getcompanyName()
  }
}
