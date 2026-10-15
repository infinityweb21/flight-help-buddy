import { inject, PLATFORM_ID } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, of, map } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { SearchService } from '../services/search.service';
import { isPlatformBrowser } from '@angular/common';
import { DealsService } from '../services/deals/deals.service';
import { DealResponse } from '../models/deal.nodel';

export const dealsResolver: ResolveFn<DealResponse | null> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const dealsService = inject(DealsService);
  const titleService = inject(Title);
  const metaService = inject(Meta);
  const searchService = inject(SearchService);
  const platformId = inject(PLATFORM_ID);
  const imageBasePath = environment.BEST_DEALS_IMAGE_BASE_PATH || '';

  const slug = route.paramMap.get('slug');

  let origin: string | null = null;
  let destination: string | null = null;

  if (isPlatformBrowser(platformId)) {
    const routeData = searchService.getRouteData();
    if (routeData) {
      origin = routeData.origin;
      destination = routeData.destination;
    }
  }
  // if (!isPlatformBrowser(platformId)) {
  //   return of(null); 
  // }
  return dealsService.getDeals(slug || '').pipe(
    map((res: DealResponse) => {
      if (!res?.data) {
        titleService.setTitle('Deals | Infinity Travels');
        return null;
      }

      const deal = res.data;

      if (deal) {

        const title = deal.MetaTitle || 'Deals | Infinity Travels';
        const description = deal.MetaDescription || '';
        const imageUrl = imageBasePath + (deal.Banner || '');
        const currentUrl = `${'https://infinitytravels.com'}${state.url}`;

        // SEO tags
        titleService.setTitle(title);
        metaService.updateTag({ name: 'description', content: description });
        metaService.updateTag({ name: 'title', content: title });
        metaService.updateTag({ property: 'og:title', content: title });
        metaService.updateTag({ property: 'og:description', content: description });
        metaService.updateTag({ property: 'og:image', content: imageUrl });
        metaService.updateTag({ property: 'og:url', content: currentUrl });
        metaService.updateTag({ rel: 'canonical', href: currentUrl });
      }

      return res;
    }),
    catchError((error) => {
      console.error('Deals resolver error:', error);
      return of(null);
    })
  );
};
