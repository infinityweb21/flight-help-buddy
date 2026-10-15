import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
  NgxIntlTelInputModule,
} from 'ngx-intl-tel-input';
import { CruisesTabComponent } from '../../../components/main-filter/cruises-tab/cruises-tab.component';
import { AuthService } from '../../../services/auth.service';
import { SpinnerService } from '../../../services/common/spinner.service';
import { TosterService } from '../../../services/common/toaster.service';
import { SearchService } from '../../../services/search.service';
import { SharedService } from '../../../services/shared/shared.service';
import { CruiseLineService } from '../../../services/destinations/cruise-line.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-details',
  imports: [
    NgFor,
    NgStyle,
    NgIf,
    ReactiveFormsModule,
    CruisesTabComponent,
    NgxIntlTelInputModule,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class DetailsComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private titleService: Title = inject(Title);
  private metaService: Meta = inject(Meta);
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
  travelFeatures = [
    {
      icon: 'fa-solid fa-sailboat',
      title: 'ELEVATED ONBOARD COMFORT',
      description:
        'Enjoy cozy, quiet cabins with ocean views and attentive service during your journey.',
    },
    {
      icon: 'fa-solid fa-calendar-check',
      title: 'STRESS-FREE BOOKING & PAYMENT',
      description:
        'Book your dream cruise through our secure and flexible payment options.',
    },
    {
      icon: 'fa-solid fa-headset',
      title: '24/7 EXPERT SUPPORT',
      description:
        'Get around-the-clock assistance for your journey from our experts from start to finish.',
    },
  ];
  activeroute: string = '';
  private router: Router = inject(Router);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  backgroundImageUrl = '';
  headerText = '';
  subHeaderText = '';
  imageBasePath: string = environment.BLOG_IMAGE_BASE_PATH;
  private shareService: SharedService = inject(SharedService);
  private toasterService: TosterService = inject(TosterService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private SpinnerService: SpinnerService = inject(SpinnerService);
  private searchService: SearchService = inject(SearchService);

  private authService: AuthService = inject(AuthService);
  private cruiseService: CruiseLineService = inject(CruiseLineService);
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
    this.activeroute = lastSegment;
    this.cdr.detectChanges();
  }
  destinations: {
    name: string;
    destination: string;
    slug: string;
    destinationName: string;
    image: string;
    description: string;
    logo: string;
  }[] = [];
  flightData: {
    name: string;
    destination: string;
    slug: string;
    destinationName: string;
    image: string;
    description: string;
    logo: string;
  }[][] = [];
  mainData: any = '';
  parsedFaq: any[] = [];
  trustedHtml: SafeHtml | null = null;
  slug: string = '';

  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();

    this.setActiveTabBasedOnRoute(this.router.url);
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTabBasedOnRoute(event.urlAfterRedirects);
      }
    });

    // First, try to get data from resolved route data
    this.route.data.subscribe((data) => {
      if (data['cruiselinesDetails']) {
        this.SpinnerService.hide();

        const matched = data['cruiselinesDetails'];
        if (matched) {
          this.mainData = matched;
          const rawHtml = this.mainData.Content;
          const cleanedHtml = this.removeInlineStyles(rawHtml);
          this.trustedHtml =
            this.sanitizer.bypassSecurityTrustHtml(cleanedHtml);
          this.backgroundImageUrl = `https://control.theinfinitytravel.com/assets/images/cruise-lines/${this.mainData?.Banner}`;
          this.headerText = this.mainData?.BannerHeading;
          this.subHeaderText = this.mainData?.BannerText;
        } else {
          this.mainData = null;
        }
        if (this.mainData?.faq) {
          try {
            this.parsedFaq = JSON.parse(this.mainData.faq);
          } catch (error) {}
        }

        this.chunkDestinations(7);
        this.cdr.detectChanges();
      }
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

  onDestinationClick(route: {
    name: string;
    destination: string;
    slug: string;
    destinationName: string;
  }) {
    if (this.slug != route.slug) {
      this.SpinnerService.show();
    }

    this.router.navigate([`/cruise-lines/${route?.slug}`]);
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
