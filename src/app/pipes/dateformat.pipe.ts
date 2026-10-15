import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'displayDate' })
export class DisplayDatePipe implements PipeTransform {
  transform(value: string | Date | null): string {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
}
