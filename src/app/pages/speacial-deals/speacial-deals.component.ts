import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { DomSanitizer, Title, Meta, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
  NgxIntlTelInputModule,
} from 'ngx-intl-tel-input';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/common/spinner.service';
import { TosterService } from '../../services/common/toaster.service';
import { TopRoutesService } from '../../services/destinations/top-routes.service';
import { SearchService } from '../../services/search.service';
import { SharedService } from '../../services/shared/shared.service';
import { NgFor, NgStyle, NgIf } from '@angular/common';
import { FlightsTabComponent } from '../../components/main-filter/flights-tab/flights-tab.component';
import { DealsService } from '../../services/deals/deals.service';
import { DealData } from '../../models/deal.nodel';

@Component({
  selector: 'app-speacial-deals',
  imports: [
    NgxIntlTelInputModule,
    NgFor,
    NgStyle,
    NgIf,
    ReactiveFormsModule,
    FlightsTabComponent,
    RouterLink
  ],
  templateUrl: './speacial-deals.component.html',
  styleUrl: './speacial-deals.component.scss',
})
export class SpeacialDealsComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  origin = '';
  destination = '';
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  imageBasePath: string = environment.BEST_DEALS_IMAGE_BASE_PATH;
  dealsRows = [{}];
  travelFeatures = [
    {
      icon: 'assets/images/top-routes/Plan-Your-Budget.png',
      title: 'TRAVEL WITH YOUR BUDGET',
      description:
        'It’s time to travel with your own budget and also fulfill all your dreams of flying.',
    },
    {
      icon: 'assets/images/top-routes/A-Journey-of-Comfort.png',
      title: 'BEST MODE OF COMFORT',
      description:
        'Witness that extra dose of comfort as you fly high with us.',
    },
    {
      icon: 'assets/images/top-routes/Easy-Booking-&-Payment.png',
      title: 'EASY BOOKING & PAYMENT',
      description:
        'Have the access to the convenient mode of payment for bookings, right now!',
    },
  ];

  activeroute: string = '';
  private router: Router = inject(Router);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  backgroundImageUrl = '';
  headerText = '';
  subHeaderText = '';
  private shareService: SharedService = inject(SharedService);
  private toasterService: TosterService = inject(TosterService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private SpinnerService: SpinnerService = inject(SpinnerService);
  private searchService: SearchService = inject(SearchService);

  private authService: AuthService = inject(AuthService);
  private dealsService: DealsService = inject(DealsService);
  getData: any = '';
  contactForm!: FormGroup;
  submitted = false;
  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: [undefined, [Validators.required, this.phoneLengthValidator]],
    });
  }

  destinations: DealData[] = [];
  mainData: any = '';
  parsedFaq: any[] = [];
  trustedHtml: SafeHtml | null = null;
  slug: string = '';
  routeData: any = '';

  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();
    this.SpinnerService.hide();
    // deals list comes from resolver
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        this.SpinnerService.hide();

        // deals list
        this.destinations = data?.deals?.data || [];
        console.log('Deals loaded from resolver:', this.destinations);

        // detail API also comes from resolver (when on details page)
        const matched =
          data?.topRouteDetailsData?.data?.route ||
          data?.dealDetailsData?.data?.[0];
        if (matched) {
          this.mainData = matched;
          const rawHtml = this.mainData.Content;
          const cleanedHtml = this.removeInlineStyles(rawHtml || '');
          this.trustedHtml =
            this.sanitizer.bypassSecurityTrustHtml(cleanedHtml);
          this.backgroundImageUrl = `https://control.theinfinitytravel.com/assets/images/top-routes/${this.mainData?.Banner}`;
          this.headerText = this.mainData?.BannerHeading;
          this.subHeaderText = this.mainData?.BannerText;
        } else {
          this.mainData = null;
        }
      });

    // set active tab based on URL
    this.setActiveTabBasedOnRoute(this.router.url);
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTabBasedOnRoute(event.urlAfterRedirects);
      }
    });
  }

  ngAfterViewInit(): void {
    this.setActiveTabBasedOnRoute(this.router.url);
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

  setActiveTabBasedOnRoute(url: string): void {
    const segments = url.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    console.log('Last segment:', lastSegment);
    this.activeroute = lastSegment;
    this.cdr.detectChanges();
  }
  removeInlineStyles(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const elementsWithStyle = doc.querySelectorAll('[style]');

    elementsWithStyle.forEach((el) => {
      el.removeAttribute('style');
    });

    return doc.body.innerHTML;
  }

  lightData: string[][] = [];

  // chunkDestinations(size: number): void {
  //   this.flightData = [];
  //   for (let i = 0; i < this.destinations.length; i += size) {
  //     this.flightData.push(this.destinations.slice(i, i + size));
  //   }
  // }

  slugify(text: string): string {
    return text
      ?.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .trim();
  }

  onDestinationClick(route: DealData) {

    if (this.slug !== route.Slug) {
      this.SpinnerService.show();
    }

    // this.router.navigate([`/deals/${route.Slug}`]);
  }


  isInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(
      control &&
      (control.touched || this.submitted) &&
      control.invalid
    );
  }

  submitContactForm() {
    this.submitted = true;
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    console.log('this.getData.email', this.getData.email);
    const payload = {
      name: this.contactForm.value['name'],
      email: '',
      phone: this.contactForm.value['phone'],
      subject: 'get a call back',
      message: 'request a call back',
      contact_email: this.getData.sendemail,
      appName: this.getData?.appName,
    };
    this.SpinnerService.show();
    this.authService
      .sendEmail(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.SpinnerService.hide();
          this.contactForm.reset();
          this.router.navigate(['/thankyou']);
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
