import { NgClass } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CountryISO,
  NgxIntlTelInputModule,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { GalleriaModule } from 'primeng/galleria';
@Component({
  selector: 'app-cycle-sonoma-napa-valley',
  imports: [ReactiveFormsModule,NgClass,NgxIntlTelInputModule,GalleriaModule],
  templateUrl: './cycle-sonoma-napa-valley.component.html',
  styleUrl: '../packages-common.scss'
})
export class CycleSonomaNapaValleyComponent {
 inquiryForm!: FormGroup;
 private fb = inject(FormBuilder)
   SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  separateDialCode = false;
    images: any[] = [];
  ngOnInit(){
     this.inquiryForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [null, Validators.required],
      departure: ['', Validators.required],
      destination: ['', Validators.required],
      days: [null, Validators.required],
      pax: [null, Validators.required],
    });
    this.images = [
      {
        itemImageSrc: 'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
        thumbnailImageSrc: 'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_2.webp',
        alt: 'Image 1',
        title: 'Title 1'
      },
      {
        itemImageSrc: 'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
        thumbnailImageSrc: 'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_3.webp',
        alt: 'Image 2',
        title: 'Title 2'
      },
      {
        itemImageSrc: 'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
        thumbnailImageSrc: 'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_4.webp',
        alt: 'Image 3',
        title: 'Title 3'
      },
         {
        itemImageSrc: 'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
        thumbnailImageSrc: 'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_5.webp',
        alt: 'Image 4',
        title: 'Title 4'
      }
      ,
         {
        itemImageSrc: 'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
        thumbnailImageSrc: 'https://infinitytravels.com/assets/images/packages/zion-ranch-stay/gallery/img_1.webp',
        alt: 'Image 5',
        title: 'Title 5'
      }
    ];
  }

   onSubmit(): void {
    if (this.inquiryForm.valid) {
      console.log('Form submitted:', this.inquiryForm.value);
      // Call API or further process here
    } else {
      this.inquiryForm.markAllAsTouched();
    }
  }



  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }
  ];


}