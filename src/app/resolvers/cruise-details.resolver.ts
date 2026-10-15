import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, of, map } from 'rxjs';
import { CruiseLineService } from '../services/destinations/cruise-line.service';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

export const cruiseDetailsResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const cruiseLineService = inject(CruiseLineService);
  const titleService = inject(Title);
  const metaService = inject(Meta);

  const cruiseSlug = route.paramMap.get('cruise'); // slug from URL
  const imageBasePath = environment.BLOG_IMAGE_BASE_PATH || '';

  if (!cruiseSlug) {
    return of(null);
  }

  return cruiseLineService.getCruiseDetails(cruiseSlug).pipe(
    map((res: any) => {
       const matched = res.data.find((item: any) => item.Slug === cruiseSlug) || null;
      if (matched) {
        // SSR meta update
        const title = matched.MetaTitle || 'Cruise Lines | Infinity Travels';
        const description = matched.MetaDescription || '';
        const imageUrl = imageBasePath + (matched.Banner || '');
        const currentUrl = `${'https://infinitytravels.com'}${state.url}`;

        titleService.setTitle(title);
        metaService.updateTag({ name: 'description', content: description });
        metaService.updateTag({ name: 'title', content: title });
        metaService.updateTag({ property: 'og:title', content: title });
        metaService.updateTag({ property: 'og:description', content: description });
        metaService.updateTag({ property: 'og:image', content: imageUrl });
        metaService.updateTag({ property: 'og:url', content: currentUrl });
        metaService.updateTag({ rel: 'canonical', href: currentUrl });
      }

      return matched;
    }),
    catchError((error) => {
      console.error('Cruise details resolver error:', error);
      return of(null);
    })
  );
};
