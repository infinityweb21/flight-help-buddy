import { NgIf, NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { TosterService } from '../../../services/common/toaster.service';
import { SpinnerService } from '../../../services/common/spinner.service';
import { AuthService } from '../../../services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchCountryField, CountryISO, PhoneNumberFormat, NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MainFilterComponent } from "../../../components/main-filter/main-filter.component";

@Component({
  selector: 'app-top-destinations-head',
  imports: [ ReactiveFormsModule, NgxIntlTelInputModule, MainFilterComponent],
  templateUrl: './top-destinations-head.component.html',
  styleUrl: './top-destinations-head.component.scss',
})
export class TopDestinationsHeadComponent implements OnInit {
  activeroute: string = '';
  private router: Router = inject(Router);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    separateDialCode = false;
      SearchCountryField = SearchCountryField;
      CountryISO = CountryISO;
      PhoneNumberFormat = PhoneNumberFormat;
      preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  backgroundImageUrl = '';
  headerText = '';
  subHeaderText = '';
  private routeBackgrounds: { [key: string]: string } = {
    london: '/assets/images/destination-banner/london.webp',
    'new-york': '/assets/images/destination-banner/new-york.webp',
    'swis-alps': '/assets/images/destination-banner/swiss-alps.webp',
    madrid: '/assets/images/destination-banner/madrid.webp',
    paris: '/assets/images/destination-banner/paris.webp',
    rome: '/assets/images/destination-banner/rome.webp',
    toronto: '/assets/images/destination-banner/singapore.webp',
    amsterdam: '/assets/images/destination-banner/Amsterdam.webp',
    maldives: '/assets/images/destination-banner/maldives.webp',
    bangkok: '/assets/images/destination-banner/bangkok.webp',
    california: '/assets/images/destination-banner/California.webp',
    florida: '/assets/images/destination-banner/florida.webp',
    singapore: '/assets/images/destination-banner/singapore.webp',
    sydney: '/assets/images/destination-banner/sydney.webp',
    tokyo: '/assets/images/destination-banner/Tokyo.webp',
    zurich: '/assets/images/destination-banner/Zurich.webp',
    'kuala-lumpur': '/assets/images/destination-banner/kuala-lumpur.webp',
    // Optional other routes:
    'top-destinations':
      '/assets/images/destination-banner/top-destinations.webp',
    'top-airlines': '/assets/images/destination-banner/top-airline.webp',
    'top-route': '/assets/images/destination-banner/top-routes.webp',
    'speacial-deals': '/assets/images/destination-banner/special-deals.webp',
    'cruise-lines': '/assets/images/destination-banner/cruise-line.webp',
    default:
      'https://infinitytravels.com/control/assets/images/top-destinations/1631957667Londonwebp.webp',
  };
  private routeHeaderTexts: { [key: string]: string } = {
    amsterdam: 'Amsterdam Awaits You',
    bangkok: 'Bangkok is Calling',
    california: 'California Dreaming Starts Here',
    florida: 'Find Fun in Florida',
    'kuala-lumpur': 'Kuala Lumpur Beckons',
    london: 'Fall in Love with London',
    madrid: 'Move to Madrid Magic',
    'new-york': 'Fly to Wonderland Now',
    paris: 'Paris is Always a Good Idea',
    rome: 'Roam Freely in Rome',
    singapore: 'Say Hello to Singapore',
    sydney: 'Step into Sydney’s Sunshine',
    tokyo: 'Take Off to Tokyo Today',
    toronto: 'Touch Down in Toronto',
    zurich: 'Zoom into Zurich',
    'swis-alps': 'Escape to the Swiss Alps',
    maldives: 'Find Bliss in the Maldives',

    // Optional or general sections
    'top-destinations': 'Explore the Best',
    'top-airlines': 'Book Your Next Flight Here',
    'top-route': 'Blue Skies & Most Popular Routes',
    'speacial-deals': 'Get The Benifits Of Exclusive Deals',
    'cruise-lines': 'Find Your Bliss on the High Seas',
    default: 'Discover the World',
  };

  private routeSubHeaderTexts: { [key: string]: string } = {
    amsterdam:
      'Let the canals whisper stories as you float through the heart of Amsterdam',
    bangkok:
      'Unleash your senses in a city where culture, spice, and sparkle collide',
    california:
      'Soak in golden sunsets and endless vibes in the land of dreams',
    florida:
      'From thrilling parks to coastal bliss, Florida is where memories are made',
    'kuala-lumpur':
      'Touch the sky with twin towers and taste every flavor of Malaysia',
    london: 'Wander through royal streets where history and modern charm meet',
    madrid: 'Let every step move to the rhythm of flamenco and timeless charm',
    'new-york':
      'Chase your boldest dreams in the city that never dares to sleep',
    paris: 'Savor romance in every step through the timeless beauty of Paris',
    rome: 'Step into a living museum where past and present embrace you',
    singapore:
      'From futuristic trees to vibrant streets, Singapore is a world in itself',
    sydney: 'Ride the waves and feel the pulse of the Aussie spirit in Sydney',
    tokyo: 'From ancient temples to neon dreams, Tokyo is a world of wonders',
    toronto: 'Where cultures unite and every corner tells a new story',
    zurich: 'Snowy peaks and serene lakes await in Switzerland’s stylish gem',
    'swis-alps':
      'Feel the crisp mountain air as you rise above the clouds in style',
    maldives: 'Sink into serenity where turquoise waters kiss the sunlit skies',
    // Optional or general sections
    'top-destinations':
      'Let your heart wander and your eyes soak in the magic as we take you towards the journey of your dreams',
    'top-airlines': 'Unbeatable fares with additional benefits. It’s time to explore the flight deals',
    'top-route': 'Wander the earth to the most sought after destinations with us! Our top routes offer you the freedom and the affordability all at once',
    'speacial-deals': 'Plan you next trip and avail the best deals with us. Plan big, travel more and spend less',
    'cruise-lines': 'Set sail on your dream voyage as you discover the world with us and book now to enjoy exclusive discounts at the perfect time of day',
    default: 'Plan your next unforgettable journey',
  };

  ngOnInit(): void {
        this.getData=this.shareService.getcompanyName();

    this.setActiveTabBasedOnRoute(this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTabBasedOnRoute(event.urlAfterRedirects);
      }
    });
  }

  ngAfterViewInit(): void {
    this.setActiveTabBasedOnRoute(this.router.url);
  }

  setActiveTabBasedOnRoute(url: string): void {
    const segments = url.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    console.log('Last segment:', lastSegment);
    this.activeroute = lastSegment;
    this.backgroundImageUrl =
      this.routeBackgrounds[lastSegment] || this.routeBackgrounds['default'];
    this.headerText =
      this.routeHeaderTexts[lastSegment] || this.routeHeaderTexts['default'];
    this.subHeaderText =
      this.routeSubHeaderTexts[lastSegment] ||
      this.routeSubHeaderTexts['default'];

    this.cdr.detectChanges();
  }
   private shareService: SharedService = inject(SharedService);
      private toasterService: TosterService = inject(TosterService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private SpinnerService: SpinnerService = inject(SpinnerService);
  private route: ActivatedRoute = inject(ActivatedRoute);

     private authService: AuthService = inject(AuthService);
  getData:any='';
  contactForm!: FormGroup;
  submitted = false;
  constructor(private fb: FormBuilder,
   
  ) {
     this.contactForm = this.fb.group({
      name: ['', Validators.required],
        phone: [undefined, [Validators.required,this.phoneLengthValidator]]
    });
  }

 phoneLengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  // Ensure value is an object and has nationalNumber
  if (value && typeof value === 'object' && value.number) {
    const digits = value.number.replace(/\D/g, ''); // remove non-digits
    const length = digits.length;

    if (length < 6 || length > 15) {
      return { invalidPhoneLength: true };
    }
  }

  return null;
}
isInvalid(field: string): boolean {
  const control = this.contactForm.get(field);
  return !!(control && (control.touched || this.submitted) && control.invalid);
}

  submitContactForm() {
       this.submitted = true;
    if (this.contactForm.invalid) {
          this.contactForm.markAllAsTouched();
      return;
    }
    console.log("this.getData.email",this.getData.email)
   const payload={
    name:this.contactForm.value['name'],
        email:'',
    phone:this.contactForm.value['phone'].e164Number,
    subject:'get a call back',
    message:'request a call back',
      contact_email:this.getData.sendemail,
  appName:this.getData?.appName
   }
   this.SpinnerService.show();
    this.authService
      .sendEmail(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
             this.SpinnerService.hide();
             this.contactForm.reset();
          this.router.navigate(['/thankyou'])
        },
        error: (err) => {
                       this.SpinnerService.hide();
          this.toasterService.showError(
            err.error.message ||
              'Something went wrong while sending the contact!'
          );
        },
      });

    
  }
}
