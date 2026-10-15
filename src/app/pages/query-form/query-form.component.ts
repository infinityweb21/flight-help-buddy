import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../services/shared/shared.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TosterService } from '../../services/common/toaster.service';
import { SpinnerService } from '../../services/common/spinner.service';
import { CountryISO, NgxIntlTelInputModule, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { DeviceService } from '../../services/shared/device.service';
import { CruiseService } from '../../services/cruise/cruise.service';
import { SearchService } from '../../services/search.service';
 
@Component({
  selector: 'app-query-form',
  imports: [ReactiveFormsModule, NgIf,NgxIntlTelInputModule],
 templateUrl: './query-form.component.html',
  styleUrl: './query-form.component.scss'
})
export class QueryFormComponent implements OnInit {
  private shareService: SharedService = inject(SharedService);
  private toasterService: TosterService = inject(TosterService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private router: Router = inject(Router);
  private SpinnerService: SpinnerService = inject(SpinnerService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private cruiseService: CruiseService = inject(CruiseService);
  private authService: AuthService = inject(AuthService);
  private searchService = inject(SearchService);
  separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  getData: any = '';
  contactForm!: FormGroup;
  submitted = false;
    isHidden = false;
  isMobile = false;
    private deviceService = inject(DeviceService);
    cruiseSearchData:any='';
  constructor(
    private fb: FormBuilder,
    private meta: Meta,
    private title: Title
  ) {
     this.deviceService.isMobile$.subscribe((status) => {
      this.isMobile = status;
      if (!this.isMobile) {
        this.isHidden = false;
      }
    });
 
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [undefined, [Validators.required,this.phoneLengthValidator]],
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
  ngOnInit(): void {
    // Set meta tags
    this.getData = this.shareService.getcompanyName();
   this.searchService.cruiseSearchData$.subscribe((searchData) => {
      console.log('Received cruise Data:', searchData);
      this.cruiseSearchData = searchData;
   });
    const metaTitle = this.route.snapshot.data['metaTitle'];
    const metaDescription = this.route.snapshot.data['metaDescription'];
 
    // Set title
    if (metaTitle) {
      this.title.setTitle(metaTitle);
    }
 
    // Set meta description
    if (metaDescription) {
      this.meta.updateTag({ name: 'description', content: metaDescription });
    }
 
    // Set additional meta tags for better SEO
    this.meta.updateTag({
      name: 'keywords',
      content:
        'contact us, customer support, travel assistance, bestplantours contact, help desk, travel support',
    });
    this.meta.updateTag({
      property: 'og:title',
      content: metaTitle || 'Contact Us - bestplantours',
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        metaDescription ||
        'Get in touch with our travel experts for assistance with your booking and travel needs.',
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({
      name: 'twitter:title',
      content: metaTitle || 'Contact Us - bestplantours',
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content:
        metaDescription ||
        'Get in touch with our travel experts for assistance with your booking and travel needs.',
    });
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
              const timestamp = Date.now().toString().slice(0, 10); // First 10 digits only
const bookingId = 'CR' + timestamp;
 
 
 
const bookingDetails = JSON.stringify({
  lead_id: bookingId,
  cruisedata: [
    {
      departureCruise: {
        portCode: this.cruiseSearchData?.departureCruises?.portCode,
        portId: this.cruiseSearchData?.departureCruises?.portId,
        name: this.cruiseSearchData?.departureCruises?.name,
        type: this.cruiseSearchData?.departureCruises?.type
      },
      startDate: this.cruiseSearchData?.startDate,
      endDate: this.cruiseSearchData?.endDate
    }
  ]
});
 
const payload = {
  name: this.contactForm.value.name,
  email: this.contactForm.value.email,
  phone: this.contactForm.value.phone,
  website: this.getData?.appName,
  city_zip: '',
  booking_details: bookingDetails,
  paymentinfo: []
};
 
console.log('Payload:', payload);
 
    this.SpinnerService.show();
    console.log('Payload:', payload);
  this.cruiseService.cruiseBookLead(payload)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (res) => {
            this.SpinnerService.hide();
        console.log("res", res);
        // this.toasterService.showSuccess("Booking cruise successful ");
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
 
  handleCtaClick(number: string, event: Event) {
 
  if (this.isMobile) {
    return; // 📱 direct call
  }
 
  event.preventDefault();
 
  this.shareService.open(number);
 
  // optional auto close
  setTimeout(() => {
    this.shareService.close();
  }, 10000);
}
}