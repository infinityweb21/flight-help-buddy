import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Inject,
  inject,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { ChunkPipe } from '../../pipes/chunk.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedService } from '../../services/shared/shared.service';
import { TosterService } from '../../services/common/toaster.service';
import { SpinnerService } from '../../services/common/spinner.service';
import { AuthService } from '../../services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { isPlatformBrowser, NgFor, NgIf, NgStyle } from '@angular/common';
import { FlightsTabComponent } from '../../components/main-filter/flights-tab/flights-tab.component';
import { TopRoutesService } from '../../services/destinations/top-routes.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
  NgxIntlTelInputModule,
} from 'ngx-intl-tel-input';
import { SearchService } from '../../services/search.service';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-top-routes',
  imports: [
    NgFor,
    NgStyle,
    NgIf,
    ReactiveFormsModule,
    FlightsTabComponent,
    NgxIntlTelInputModule,
    RouterLink
  ],
  templateUrl: './top-routes.component.html',
  styleUrl: './top-routes.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TopRoutesComponent {
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
  imageBasePath: string = environment.BLOG_IMAGE_BASE_PATH;
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
  private topRoutesService: TopRoutesService = inject(TopRoutesService);
  getData: any = '';
  contactForm!: FormGroup;
  submitted = false;
  isBrowser = false;
  constructor(private fb: FormBuilder,@Inject(PLATFORM_ID) private platformId: Object,) {
        this.isBrowser = isPlatformBrowser(this.platformId);

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
  trustedHtml: SafeHtml | null = null;
  slug: string = '';
  routeData: any = '';
  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();
    // console.log('this.getData', this.getData);

    this.setActiveTabBasedOnRoute(this.router.url);
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTabBasedOnRoute(event.urlAfterRedirects);
      }
    });
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data: any) => {
      this.SpinnerService.hide();
      console.log('matched', data);
      const matched = data?.topRouteDetailsData?.data?.route || [];
      console.log('matched', matched);
      if (matched) {
        this.mainData = matched;
        const rawHtml = this.mainData.Content;
        const cleanedHtml = this.removeInlineStyles(rawHtml);
        this.trustedHtml =
          this.sanitizer.bypassSecurityTrustHtml(cleanedHtml);
        this.backgroundImageUrl = `https://control.theinfinitytravel.com/assets/images/top-routes/${this.mainData?.Banner}`;
        this.headerText = this.mainData?.BannerHeading;
        this.subHeaderText = this.mainData?.BannerText;


      } else {
        this.mainData = null;
      }
      if (this.mainData?.faq) {
        try {
          this.parsedFaq = JSON.parse(this.mainData.faq);
          console.log('this.parsedFaq', this.parsedFaq);
        } catch (error) {
          console.error('Invalid FAQ JSON:', error);
        }
      }
      const today = new Date();
      const futureDate = new Date(today.setDate(today.getDate() + 15));
      this.destinations = data.topRouteDetailsData.data?.related_routes.map((route: any) => ({
        name: route.name,

        slug: route?.slug,

        futureDate: futureDate,
      }));
      this.chunkDestinations(7);
      this.cdr.detectChanges();

    });


  }


  removeInlineStyles(html: string): any {
 if (!isPlatformBrowser(this.platformId)) return;

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

  onDestinationClick(route: {
    name: string;
    slug: string;
  }) {
    if (this.slug != route.slug) {
      this.SpinnerService.show();
    }

    this.searchService.setRouteData(route);
    // this.router.navigate([`/top-routes/${route?.slug}`]);
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
