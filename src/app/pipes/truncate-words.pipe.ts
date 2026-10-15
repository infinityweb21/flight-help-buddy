// truncate-words.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateWords'
})
export class TruncateWordsPipe implements PipeTransform {
  transform(value: string, limit: number = 30): string {
    if (!value) return '';
    const words = value.split(/\s+/);
    return words.length > limit
      ? words.slice(0, limit).join(' ') + '...'
      : value;
  }
}
