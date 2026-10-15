import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCardNumber]'
})
export class CardNumberDirective {

  private previousRaw = '';

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = event.target;

    // Get raw digits (remove spaces)
    let raw = input.value.replace(/\D/g, '');

    // Prevent double-update reset by Angular
    if (raw === this.previousRaw) return;

    // Limit to 16 digits max
    raw = raw.substring(0, 16);

    // Apply formatting
    const formatted = this.format(raw);

    this.previousRaw = raw;

    // Prevent clearing: update AFTER current input cycle
    setTimeout(() => {
      input.value = formatted;

      if (this.control?.control) {
        this.control.control.setValue(formatted, { emitEvent: false });
      }
    });
  }

  private format(value: string): string {
    if (value.length <= 4) return value;
    if (value.length <= 8) return value.replace(/(\d{4})(\d+)/, '$1 $2');
    if (value.length <= 12) return value.replace(/(\d{4})(\d{4})(\d+)/, '$1 $2 $3');

    return value.replace(
      /(\d{4})(\d{4})(\d{4})(\d*)/,
      (_, a, b, c, d) => (d ? `${a} ${b} ${c} ${d}` : `${a} ${b} ${c}`)
    );
  }
}
