import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, EventEmitter, HostListener, Inject, Output, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {

   @Output() clickOutside = new EventEmitter<void>();

  constructor(private el: ElementRef,@Inject(PLATFORM_ID) private platformId: Object,) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    if (!isPlatformBrowser(this.platformId)) return;

    const clickedInside = this.el.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }

}
