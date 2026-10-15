import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitPricePart'
})
export class SplitPricePartPipe implements PipeTransform {
  transform(value: string, partIndex: number): string {
    if (!value) return '';
    const [integer, decimal] = value.toString().split('.');
    return partIndex === 0 ? integer : (decimal || '00');
  }
}
