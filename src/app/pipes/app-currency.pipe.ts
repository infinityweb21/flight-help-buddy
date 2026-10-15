import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'appCurrency',
  standalone: true
})
export class AppCurrencyPipe implements PipeTransform {
  
  // Centralized currency configuration
  private currencyConfig = {
    currencyCode: 'USD',
    display: 'symbol-narrow' as 'symbol-narrow' | 'symbol' | 'code',
    digitsInfo: '.2'
  };

  private currencyPipe = new CurrencyPipe('en-US');

  transform(value: number | string | null | undefined): string | null {
    return this.currencyPipe.transform(
      value, 
      this.currencyConfig.currencyCode, 
      this.currencyConfig.display, 
      this.currencyConfig.digitsInfo
    );
  }

  // Method to get current currency code (useful for components)
  getCurrentCurrencyCode(): string {
    return this.currencyConfig.currencyCode;
  }

  // Method to update currency (if needed dynamically)
  updateCurrency(currencyCode: string, display?: 'symbol-narrow' | 'symbol' | 'code', digitsInfo?: string): void {
    this.currencyConfig.currencyCode = currencyCode;
    if (display) this.currencyConfig.display = display;
    if (digitsInfo) this.currencyConfig.digitsInfo = digitsInfo;
  }
}