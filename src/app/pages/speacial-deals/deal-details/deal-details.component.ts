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
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
  NgxIntlTelInputModule,
} from 'ngx-intl-tel-input';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { SpinnerService } from '../../../services/common/spinner.service';
import { TosterService } from '../../../services/common/toaster.service';
import { SearchService } from '../../../services/search.service';
import { SharedService } from '../../../services/shared/shared.service';
import { NgIf } from '@angular/common';
import { FlightsTabComponent } from '../../../components/main-filter/flights-tab/flights-tab.component';

@Component({
  selector: 'app-deal-details',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FlightsTabComponent,
    NgxIntlTelInputModule,
  ],
  templateUrl: './deal-details.component.html',
  styleUrl: './deal-details.component.scss',
})
export class DealDetailsComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  origin = '';
  destination = '';
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private titleService: Title = inject(Title);
  private metaService: Meta = inject(Meta);
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];

  imageBasePath: string = environment.BEST_DEALS_IMAGE_BASE_PATH;

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

  getData: any = '';
  contactForm!: FormGroup;
  submitted = false;
  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: [undefined, [Validators.required, this.phoneLengthValidator]],
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

  ngAfterViewInit(): void {
    this.setActiveTabBasedOnRoute(this.router.url);
  }

  setActiveTabBasedOnRoute(url: string): void {
    const segments = url.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    console.log('Last segment:', lastSegment);
    this.activeroute = lastSegment;
    this.cdr.detectChanges();
  }
  destinations: {
    name: string;
    origin: string;
    destination: string;
    slug: string;
    originName: string;
    destinationName: string;
  }[] = [];
  flightData: {
    name: string;
    origin: string;
    destination: string;
    slug: string;
    originName: string;
    destinationName: string;
  }[][] = [];
  mainData: any = '';
  parsedFaq: any[] = [];
  bannerAltText: string = '';
  trustedHtml: SafeHtml | null = null;
  slug: string = '';
  routeData: any = '';
  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();
    this.SpinnerService.hide();

    this.setActiveTabBasedOnRoute(this.router.url);
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTabBasedOnRoute(event.urlAfterRedirects);
      }
    });

    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        this.SpinnerService.hide();
        const matched = data?.dealDetails?.data || null;

        if (matched) {
          this.mainData = matched;
          console.log('Matched deal data:', this.mainData);
          //  Bind meta tags
          // console.log("Title:", this.mainData.MetaTitle);

          // this.titleService.setTitle(this.mainData.MetaTitle);
          // this.metaService.updateTag({
          //   name: 'description',
          //   content: this.mainData.MetaDescription,
          // });
          // this.metaService.updateTag({
          //   name: 'keywords',
          //   content: this.mainData.MetaKeyword,
          // });

          const rawHtml = this.mainData.Content;
          // const cleanedHtml = this.removeInlineStyles(rawHtml || '');
          this.trustedHtml = this.sanitizer.bypassSecurityTrustHtml(rawHtml);

          this.backgroundImageUrl = `${this.imageBasePath}${this.mainData.Banner}`;
          this.headerText = this.mainData.BannerHeading;
          this.subHeaderText = this.mainData.BannerText;
          this.bannerAltText = this.mainData.BannerAltText;
          console.log('Banner Alt Text:', this.bannerAltText);
        } else {
          this.mainData = null;
        }

        // FAQ handling
        if (this.mainData?.faq) {
          try {
            this.parsedFaq = JSON.parse(this.mainData.faq);
          } catch (error) {
            console.error('Invalid FAQ JSON:', error);
          }
        }

        // Related routes if provided
        this.destinations =
          data.dealDetails?.data?.related_routes?.map((route: any) => ({
            name: route.Name,
            slug: route.Slug,
            origin: route.Origin,
            destination: route.Destination,
            originName: route.OriginName,
            destinationName: route.DestinationName,
          })) || [];

        this.chunkDestinations(7);
        this.cdr.detectChanges();
      });
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

  chunkDestinations(size: number): void {
    this.flightData = [];
    for (let i = 0; i < this.destinations.length; i += size) {
      this.flightData.push(this.destinations.slice(i, i + size));
    }
  }

  slugify(text: string): string {
    return text
      ?.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .trim();
  }

  onDestinationClick(route: { name: string; slug: string }) {
    if (this.slug != route.slug) {
      this.SpinnerService.show();
    }

    this.searchService.setRouteData(route);
    this.router.navigate([`/top-routes/${route?.slug}`]);
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
