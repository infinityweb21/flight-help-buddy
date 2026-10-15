import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationToHours'
})
export class DurationToHoursPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    // Flexible regex (D, H, M optional)
    const regex = /(?:(\d+)D)?\s*(?:(\d+)H)?\s*(?:(\d+)M)?/i;
    const match = value.match(regex);

    if (!match) return value;

    const days = Number(match[1] || 0);
    const hours = Number(match[2] || 0);
    const mins = Number(match[3] || 0);

    // If D exists → convert to hours
    if (match[1]) {
      const totalHours = days * 24 + hours;
      return `${totalHours}h ${mins}m`;
    }

    // If no D → return normal formatted
    if (match[2] || match[3]) {
      return `${hours}h ${mins}m`;
    }

    return value;
  }
}