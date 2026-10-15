import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[nospace]'
})
export class AllowMiddleSpaceDirective {

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let value = event.target.value;

    // 1. Remove leading spaces
    value = value.replace(/^\s+/, '');

    // 2. Remove trailing spaces
    value = value.replace(/\s{2,}/g, ' ');


    event.target.value = value;
  }
}
