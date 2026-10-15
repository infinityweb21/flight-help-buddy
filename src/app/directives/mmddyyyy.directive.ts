import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appMMDDYYYY]'
})
export class MMDDYYYYDirective {

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, ''); // only numbers

    if (value.length > 8) {
      value = value.substring(0, 8);
    }

    if (value.length >= 5) {
      value = value.replace(
        /^(\d{2})(\d{2})(\d{0,4})$/,
        '$1/$2/$3'
      );
    } else if (value.length >= 3) {
      value = value.replace(
        /^(\d{2})(\d{0,2})$/,
        '$1/$2'
      );
    }

    input.value = value;
  }
}
