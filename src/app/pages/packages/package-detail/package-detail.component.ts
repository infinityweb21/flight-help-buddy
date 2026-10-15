import { NgClass } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CountryISO,
  NgxIntlTelInputModule,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { GalleriaModule } from 'primeng/galleria';
import { TravelPackage } from '../../../models/package.interface';
import { PackagesService } from '../../../services/packages.service';
import { SpinnerService } from '../../../services/common/spinner.service';
import { AuthService } from '../../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TosterService } from '../../../services/common/toaster.service';

@Component({
  selector: 'app-package-detail',
  imports: [ReactiveFormsModule, NgClass, NgxIntlTelInputModule, GalleriaModule],
  templateUrl: './package-detail.component.html',
  styleUrls: ['../packages-common.scss']
})
export class PackageDetailComponent implements OnInit {
  inquiryForm!: FormGroup;
  packageData: TravelPackage | any = null;
  loading = true;
  
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private packagesService = inject(PackagesService);
  private SpinnerService:SpinnerService=inject(SpinnerService)
  private sanitizer = inject(DomSanitizer);
  private authService=inject(AuthService)
  private destroyRef=inject(DestroyRef)
  private toasterService=inject(TosterService)

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  separateDialCode = false;

  ngOnInit(): void {
    this.initializeForm();
    this.loadPackageData();
  }

  private initializeForm(): void {
    this.inquiryForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [null, Validators.required],
      departure: ['', Validators.required],
      destination: ['', Validators.required],
      days: [null, Validators.required],
      pax: [null, Validators.required],
    });
  }

  private loadPackageData(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    console.log("=== LOADING PACKAGE DATA ===");
    console.log("Slug:", slug);
    
    if (!slug) {
      this.router.navigate(['/packages']);
      return;
    }

    this.packageData = this.packagesService.getPackageBySlug(slug);
    console.log("Package data loaded:", this.packageData);
    console.log("Package images:", this.packageData?.images);
    
    if (!this.packageData) {
      console.log("No package data found, redirecting...");
      this.router.navigate(['/packages']);
      return;
    }

    this.loading = false;
    console.log("Loading complete");
  }
submitted=false
  onSubmit(): void {
    this.submitted = true;
    if (this.inquiryForm.invalid) {
      this.inquiryForm.markAllAsTouched();
      return;
    }
    const payload = {
      name: this.inquiryForm.value['fullName'],
      email: this.inquiryForm.value['email'],
      phone: this.inquiryForm.value['phone'].e164Number,
      subject: 'cruise inquiry',
      message:'cruise inquiry',
      contact_email: ['booking@theinfinitytravel.com','azharislam21@gmail.com'],
      appName: 'Infinity Travel',
      template:'inquiry',
      departure: this.inquiryForm.value['departure'],
      destination: this.inquiryForm.value['destination'],
      days: this.inquiryForm.value['days'],
      pax: this.inquiryForm.value['pax'],
    };
    console.log(payload);

      this.SpinnerService.show();
      this.authService
        .sendEmail(payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.SpinnerService.hide();
            this.inquiryForm.reset();
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

  get images() {
    console.log("=== IMAGES GETTER CALLED ===");
    console.log("this.packageData:", this.packageData);
    console.log("this.packageData?.images:", this.packageData?.images);
    
    return this.packageData?.images || [];
  }

  get responsiveOptions() {
    return this.packageData?.responsiveOptions || [];
  }

  get safeMapUrl(): SafeResourceUrl | null {
    if (!this.packageData?.sections?.location?.mapUrl) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.packageData.sections.location.mapUrl);
  }
}