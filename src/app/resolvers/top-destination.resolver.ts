import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { catchError, of } from 'rxjs';
import { TopDestinationService } from '../services/destinations/top-destination.service';
import { Title, Meta } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

export const topDestinationResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
) => {
  const topDestinationService = inject(TopDestinationService);
  const titleService = inject(Title);
  const metaService = inject(Meta);

  return topDestinationService.getTopDestinations().pipe(
    map((res: any) => {
      const title =
        "Find The World's Best Travel Destinations To Visit | Infinity Travels";
      const description =
        "Choose to fly with Infinity Travels to find the world's best travel destinations to visit and make the best memories with your loved ones. Book your tickets today.";

      titleService.setTitle(title);
      metaService.updateTag({ name: 'description', content: description });
      metaService.updateTag({ name: 'title', content: title });
      metaService.updateTag({ property: 'og:title', content: title });
      metaService.updateTag({
        property: 'og:description',
        content: description,
      });

      return res;
    }),
    catchError((error) => {
      console.error('Blog details resolver error:', error);
      return of(null);
    })
  );
};
