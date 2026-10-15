import { Directive, HostListener, inject } from '@angular/core';
import { Location, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[appBack]',
  standalone: true
})
export class BackDirective {

  private location = inject(Location);
  private platformId = inject(PLATFORM_ID);

  @HostListener('click')
  onClick() {
    if (isPlatformBrowser(this.platformId)) {
      if (history.length > 1) {
        this.location.back();
      } else {
        this.location.go('/'); // Fallback
      }
    }
  }
}
