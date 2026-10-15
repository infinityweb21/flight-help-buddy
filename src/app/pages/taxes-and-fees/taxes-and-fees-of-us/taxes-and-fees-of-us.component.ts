import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { LocationService } from '../../../services/shared/location.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-taxes-and-fees-of-us',
  imports: [ProgressSpinnerModule],
  templateUrl: './taxes-and-fees-of-us.component.html',
  styleUrl: './taxes-and-fees-of-us.component.scss'
})
export class TaxesAndFeesOfUsComponent {
  private shareService: SharedService = inject(SharedService);
  private locationService: LocationService = inject(LocationService);
  private meta: Meta = inject(Meta);
  private title: Title = inject(Title);
  private route: ActivatedRoute = inject(ActivatedRoute);

  getData: any = '';
  country: string = 'US';
  loading: boolean = false;

  // Placeholders for binding
  taxesAndFees: any[] = [];
  ourFees: any[] = [];
  pageContent: any = {};

  canadaData = {
    taxesAndFees: [
      {
        name: 'NAV Canada Surcharge',
        description: 'Applies to all flight segments to or from Canada.',
        may_apply_to: 'Canada Domestic, Transborder USA & International',
        code: 'Q',
        amount: 'Up to C$40.00',
      },
      {
        name: 'Insurance Surcharge',
        description: 'Applies to flights wholly within Canada.',
        may_apply_to: 'Canada Domestic',
        code: 'Q',
        amount: 'C$6.00',
      },
      {
        name: 'Canada Airport Improvement Fee',
        description:
          'Variable fee based on airport for facilities improvement.',
        may_apply_to: 'Canada Domestic, Transborder USA & International',
        code: 'SQ',
        amount: 'Up to C$40.00',
      },
      {
        name: 'Air Travellers Security Charge',
        description:
          'Canada government-assessed fee for security personnel and equipment.',
        may_apply_to: 'Canada Domestic, Transborder USA & International',
        code: 'CA',
        amount: 'Up to C$33.00',
      },
      {
        name: 'Fuel Surcharge',
        description:
          'Applies to all flight segments to or from Canada to International destinations.',
        may_apply_to: 'International',
        code: 'YQ',
        amount: 'Up to C$300',
      },
      {
        name: 'International Taxes and Fees',
        description:
          'Various foreign taxes, inspection fees, and security charges typically excluding airport departure taxes.',
        may_apply_to: 'International',
        code: 'Varies',
        amount: 'C$250',
      },
      {
        name: 'GST/HST/QST/PST (BC, Sask, MB)',
        description:
          'Goods & Services Tax/Harmonized Sales Tax/Quebec Sales Tax/Provincial Sales Tax',
        may_apply_to: 'Canada Domestic, USA & International',
        code: 'XG, RC, XQ',
        amount: 'varies',
      },
      {
        name: 'Travel Facilities Tax',
        description:
          '(aka Alaska/Hawaii Ticket Tax) Applies to certain flight segments to or from Alaska or Hawaii.',
        may_apply_to: 'USA Domestic and International',
        code: 'US',
        amount: 'C$8.00',
      },
      {
        name: 'USA Federal Segment Fee',
        description:
          'Per-segment fee applicable to flights within the continental United States.',
        may_apply_to: 'USA Domestic and International',
        code: 'ZP',
        amount: 'C$3.60',
      },
      {
        name: 'Passenger Facility Charge (PFC)',
        description:
          'Variable fee based on airport for facilities improvement. A maximum of 4 charges per itinerary applies.',
        may_apply_to: 'USA Domestic and International',
        code: 'XF',
        amount: 'up to C$4.50',
      },
      {
        name: 'September 11th Security Fee',
        description:
          'USA government-assessed fee for security costs, not exceeding certain limits.',
        may_apply_to: 'USA Domestic and International',
        code: 'AY',
        amount: 'C$2.50',
      },
      {
        name: 'USA International Transportation (Arrival/Departure) Tax',
        description:
          'Applies to all flights arriving in or departing from the United States, Puerto Rico, or the USA Virgin Islands.',
        may_apply_to: 'International',
        code: 'US',
        amount: 'C$16.10',
      },
      {
        name: 'USA Animal and Plant Health Inspection Service (APHIS) Fee',
        description:
          'Applies to all flights originating abroad, except Canada, and landing in the United States, Puerto Rico, or the USA Virgin Islands.',
        may_apply_to: 'International',
        code: 'XA',
        amount: 'C$5.00',
      },
      {
        name: 'USA Immigration and Naturalization Fee',
        description:
          'Applies to international arrivals to the United States, Puerto Rico, or the USA Virgin Islands.',
        may_apply_to: 'International',
        code: 'XY',
        amount: 'C$7.00',
      },
      {
        name: 'USA Customs User Fee',
        description:
          'Applies to international arrivals from outside of the USA Customs territory.',
        may_apply_to: 'International',
        code: 'YC',
        amount: 'C$5.50',
      },
    ],
    ourFees: [
      {
        name: 'Airfare Fees',
        description:
          'On most airfares Our Fee of up to C$140◊ is charged above published or negotiated airfares on a per-passenger, per-ticket basis.**',
        may_apply_to: 'Canada domestic, Transborder and International',
        code: 'Fees',
        amount: 'C$0.00 to C$140.00',
      },
      {
        name: 'Hotel Fees',
        description: '(per night, per room)',
        may_apply_to: 'All Hotels',
        code: 'Fees',
        amount: 'up to C$37.00',
      },
      {
        name: 'Car Rental Fees',
        description: '(per rental)',
        may_apply_to: 'All Car Rentals',
        code: 'Fees',
        amount: 'C$30.00',
      },
    ],
    pageContent: {
      notes: [
        'Our Fees will be converted in your local currency on the payment page.',
        '* Approximate amount.',
        '** Passenger types = Adult, child, senior, infant, student, military.',
        '‡ Our Fees are non-refundable and are subject to change without notice.',
        'Our Fees may be subject to GST/HST/QST/PST. Government imposed taxes and fees are subject to change. You will only be charged the final total amount as shown in the relevant Charge.',
      ],
      exceptions: {
        title: '◊ Certain exceptions to Our Fees above apply:',
        items: [
          'Online vacation package Fees up to C$50 per passenger.',
          'Business and First Class Airfares - Fees are up to C$200 per passenger on all passenger type tickets.',
          'Multi-city trips - Fees are up to C$100 per passenger on all passenger type tickets.',
          'Multi airline trips / Cities with high fraud rates - Fees are up to C$50 per passenger on all passenger type tickets.',
          'Foreign Origination (Originating outside US or Canada) - Fees are up to C$50 per passenger for all passenger types.',
        ],
      },
      contactCenter: {
        title: 'Contact Center fees:',
        description:
          'Fees for Travel Services involving our contact center (including complex multi-stop and round-the-world itineraries) may be higher than those charged for bookings made online. These Fees can range from C$10 to C$275 per passenger (up to C$125 for Senior Citizens). Contact center Travel Service bookings include premium package benefits.',
      },
      importantNote: {
        title: '◊ Important Note:',
        description:
          'Our Fees are subject to change without notice. YOU WILL BE CHARGED THE FINAL AMOUNT AS QUOTED REGARDLESS OF ANY CHANGE OR VARIANCE IN ANY CHARGES. Please review the total final amount carefully.',
      },
    },
  };

  usData = {
    taxesAndFees: [
      {
        name: 'USA Federal Segment Fee –',
        description: 'Per-segment fee on flights within the continental USA',
        may_apply_to: 'USA Domestic & Intl.',
        code: 'ZP',
        amount: '$5.20',
      },
      {
        name: 'USA Excise Tax (USA Domestic Transportation Tax) –',
        description:
          '7.5% of base fare. It applies to flights within the USA or Canada/Mexico 225-mile buffer. Prorated for Alaska/Hawaii',
        may_apply_to: 'USA Domestic & Intl.',
        code: 'US',
        amount: '7.50%',
      },
      {
        name: 'Travel Facilities Tax (Alaska/Hawaii Ticket Tax) – ',
        description:
          'Applies to flights between the continental USA and Alaska/Hawaii',
        may_apply_to: 'USA Domestic & Intl.',
        code: 'US',
        amount: '$11.40',
      },
      {
        name: 'Passenger Facility Charge (PFC) –',
        description:
          'Airport facility improvement fee, up to $4.50 each (max 4 charges per itinerary)',
        may_apply_to: 'USA Domestic & Intl.',
        code: 'XF',
        amount: 'Up to $18.00',
      },
      {
        name: 'USA Passenger Civil Aviation Security Fee (September 11th Fee) –',
        description:
          '$5.60 per one-way; $11.20 per round trip; may accrue multiple times with stopovers',
        may_apply_to: 'USA Domestic & Intl.',
        code: 'AY',
        amount: '$5.60 (one-way)',
      },
      {
        name: 'USA International Transportation Tax – ',
        description:
          'Applies to all international flights to/from the USA, Puerto Rico, USA Virgin Islands',
        may_apply_to: 'International',
        code: 'US',
        amount: '$22.90',
      },
      {
        name: 'USA APHIS (Animal & Plant Health Inspection Service) Fee –',
        description:
          ' Applies to flights arriving in the USA from abroad (except Canada)',
        may_apply_to: 'International',
        code: 'XA',
        amount: '$3.96',
      },
      {
        name: 'USA Immigration Inspection Fee –',
        description:
          'Applies to international arrivals to the USA, Puerto Rico, USA Virgin Islands',
        may_apply_to: 'International',
        code: 'XY',
        amount: '$7.00',
      },
      {
        name: 'USA Customs Inspection Fee – ',
        description:
          'Applies to international arrivals from outside USA customs territory',
        may_apply_to: 'International',
        code: 'YC',
        amount: '$7.20',
      },
      {
        name: 'Foreign Government & Airport Fees –',
        description:
          'Taxes/fees such as inspection charges, airport security, departure taxes',
        may_apply_to: 'International',
        code: 'Varies',
        amount: 'Varies (up to several hundred USD)',
      },
    ],
    ourFees: [
      {
        // name: 'Ticketing Fee',
        description: 'Multi-City Trips',
        may_apply_to: 'Multi-destination itineraries',
        // code: 'TF',
        amount: 'Up to $100 per passenger',
      },
      {
        // name: 'Hotel Booking Fee',
        description: 'Multi-Airline / High-Fraud Routes',
        may_apply_to: 'Selected cities',
        // code: 'HF',
        amount: 'Up to $50 per passenger',
      },
      {
        // name: 'Car Rental Fee',
        description: 'Nearby Airport / Alternative Date Search',
        may_apply_to: 'Flexible travel bookings',
        // code: 'CRF',
        amount: 'Up to $50 per passenger',
      },
      {
        // name: 'Car Rental Fee',
        description: 'Fusion Fares',
        may_apply_to: 'Value-deal fares',
        // code: 'CRF',
        amount: 'Up to $100 per passenger',
      },
      {
        // name: 'Car Rental Fee',
        description: 'Customer Care / Contact Center Bookings',
        may_apply_to: 'Complex, RTW, multi-stop',
        // code: 'CRF',
        amount: '$10 - $200 (up to $100 for Seniors)',
      },
    ],
    pageContent: {
      notes: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        '* Lorem ipsum dolor sit amet.',
        '** Vestibulum ante ipsum primis in faucibus orci luctus et.',
        '‡ Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      ],
      exceptions: {
        title: '◊ Lorem ipsum exceptions apply:',
        items: [
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
          'Excepteur sint occaecat cupidatat non proident, sunt in culpa.',
        ],
      },
      contactCenter: {
        title: 'Contact Center:',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      importantNote: {
        title: '◊ Important Note:',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. YOU WILL BE CHARGED THE FINAL AMOUNT AS QUOTED REGARDLESS OF ANY CHANGE OR VARIANCE.',
      },
    },
  };
  constructor(
    private zone: NgZone,
    private cd: ChangeDetectorRef,

  ) { }
  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();

    // this.country = 'US';
    this.country = 'US';
    this.taxesAndFees = this.usData.taxesAndFees;
    this.ourFees = this.usData.ourFees;
    this.pageContent = this.usData.pageContent;
    this.loading = true;

    // Async location fetch
    this.locationService.getExactLocation()
      .then(location => {
        this.zone.run(() => {
          if (location.address && location.address.includes('Canada')) {
            this.country = 'Canada';
            this.taxesAndFees = this.canadaData.taxesAndFees;
            this.ourFees = this.canadaData.ourFees;
            this.pageContent = this.canadaData.pageContent;
          }

          // Done loading
          this.loading = false;

          // Trigger change detection explicitly
          this.cd.detectChanges();
        });
      })
      .catch(err => {
        console.error('Error getting location', err);
        this.zone.run(() => {
          this.country = 'US';
          this.taxesAndFees = this.usData.taxesAndFees;
          this.ourFees = this.usData.ourFees;
          this.pageContent = this.usData.pageContent;

          this.loading = false;
          this.cd.detectChanges();
        });
      });

    // Meta tags (unchanged)
    const metaTitle = this.route.snapshot.data['metaTitle'];
    const metaDescription = this.route.snapshot.data['metaDescription'];

    if (metaTitle) this.title.setTitle(metaTitle);
    if (metaDescription) this.meta.updateTag({ name: 'description', content: metaDescription });

    this.meta.updateTag({
      name: 'keywords',
      content:
        'travel service fees, booking fees, flight fees, hotel fees, cruise fees, car hire fees, travel costs, transparency',
    });
    this.meta.updateTag({ property: 'og:title', content: metaTitle || 'Understand Our Travel Service Fees | Infinity Travel' });
    this.meta.updateTag({
      property: 'og:description',
      content:
        metaDescription ||
        'View booking fee details for all services - flights, hotels, car hires, and cruises. Plan smarter by knowing exactly how much you’re being charged.',
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: metaTitle || 'Understand Our Travel Service Fees | Infinity Travel' });
    this.meta.updateTag({
      name: 'twitter:description',
      content:
        metaDescription ||
        'View booking fee details for all services - flights, hotels, car hires, and cruises. Plan smarter by knowing exactly how much you’re being charged.',
    });
  }


  loadData() {
    if (this.country === 'US') {
      this.taxesAndFees = this.usData.taxesAndFees;
      this.ourFees = this.usData.ourFees;
      this.pageContent = this.usData.pageContent;
    } else {
      this.taxesAndFees = this.canadaData.taxesAndFees;
      this.ourFees = this.canadaData.ourFees;
      this.pageContent = this.canadaData.pageContent;
    }
  }
}