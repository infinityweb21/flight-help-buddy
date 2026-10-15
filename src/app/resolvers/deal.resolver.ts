import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, of, map } from 'rxjs';
import { DealsService } from '../services/deals/deals.service';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

export const dealResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const dealsService = inject(DealsService);
  const titleService = inject(Title);
  const metaService = inject(Meta);
  const imageBasePath = environment.BEST_DEALS_IMAGE_BASE_PATH || '';

  return dealsService.getDeal().pipe(
    map((res: any) => {
      if (!res?.data) {
        titleService.setTitle('Deal | Infinity Travels');
        return null;
      }

      const deal = res.data;
      console.log('Fetched deal data:', deal);

      if (deal) {
        const title = deal.MetaTitle || 'Deal | Infinity Travels';
        const description = deal.MetaDescription || '';
        const imageUrl = imageBasePath + (deal.Banner || '');
        const currentUrl = `${'https://infinitytravels.com'}${state.url}`;

        // Set SEO tags
        titleService.setTitle(title);
        metaService.updateTag({ name: 'description', content: description });
        metaService.updateTag({ name: 'title', content: title });
        metaService.updateTag({ property: 'og:title', content: title });
        metaService.updateTag({ property: 'og:description', content: description });
        metaService.updateTag({ property: 'og:image', content: imageUrl });
        metaService.updateTag({ property: 'og:url', content: currentUrl });
      }

      return res;
    }),
    catchError((error) => {
      console.error('Deal resolver error:', error);
      return of(null);
    })
  );
};
