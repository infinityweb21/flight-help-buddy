import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Inject, Input, NgZone, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { NgControl } from '@angular/forms';

declare var google: any;

@Directive({
  selector: '[googlePlacesAutocomplete]',
  standalone: true
})
export class GooglePlacesAutocompleteDirective implements OnInit {
  @Input() autocompleteType: 'country' | 'address' = 'address'; // NEW ✅
  @Output() placeChanged = new EventEmitter<any>();
  @Output() countryChanged = new EventEmitter<string>();

  private autocomplete: any;

  constructor(
    private elementRef: ElementRef,
    private ngControl: NgControl,
    private ngZone: NgZone,@Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    this.initAutocomplete();
  }

  private initAutocomplete() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
      setTimeout(() => {
        const types = this.autocompleteType === 'country' ? ['(regions)'] : ['establishment'];

        this.autocomplete = new google.maps.places.Autocomplete(
          this.elementRef.nativeElement,
          {
            types,
            // Use this only if you want to restrict to certain countries:
            // componentRestrictions: { country: ['us', 'in'] }
          }
        );

        this.autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place = this.autocomplete.getPlace();

            if (place?.formatted_address) {
              this.ngControl.control?.setValue(place.formatted_address);
              this.ngControl.control?.markAsDirty();
              this.ngControl.control?.markAsTouched();

              this.placeChanged.emit(place);

              const countryComponent = place.address_components?.find((component: any) =>
                component.types.includes('country')
              );

              if (countryComponent) {
                this.countryChanged.emit(countryComponent.long_name);
              }
            }
          });
        });
      }, 100);
    } else {
      console.error('Google Maps API not loaded.');
    }
  }
}
