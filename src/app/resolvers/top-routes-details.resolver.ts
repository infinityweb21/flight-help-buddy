import { inject, PLATFORM_ID } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, of, map } from 'rxjs';
import { TopRoutesService } from '../services/destinations/top-routes.service';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { SearchService } from '../services/search.service';
import { isPlatformBrowser } from '@angular/common';

export const topRoutesDetailsResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const topRoutesService = inject(TopRoutesService);
  const titleService = inject(Title);
  const metaService = inject(Meta);
  const searchService = inject(SearchService);
  const platformId = inject(PLATFORM_ID);
  const imageBasePath = environment.BLOG_IMAGE_BASE_PATH || '';

  const segments = route.url.map(s => s.path);
  const slug = segments.length > 1 ? segments[1] : null;

  // Try to get origin/destination only in browser
  let origin: string | null = null;
  let destination: string | null = null;

  if (isPlatformBrowser(platformId)) {
    const routeData = searchService.getRouteData();
    if (routeData) {
      origin = routeData.origin;
      destination = routeData.destination;
    }
  }



  return topRoutesService.getToproutesDetails(slug).pipe(
    map((res: any) => {
      if (!res?.data ) {
        // Fallback meta for SSR if nothing found
        titleService.setTitle('Top Routes | Infinity Travels');
        metaService.updateTag({ name: 'description', content: '' });
        return null;
      }

      const matched = res.data?.route;

      if (matched) {
        const title = matched.MetaTitle || 'Top Routes | Infinity Travels';
        const description = matched.MetaDescription || '';
        const imageUrl = imageBasePath + (matched.Banner || '');
        const currentUrl = `${'https://infinitytravels.com'}${state.url}`;

        // Meta tags for SSR
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
      console.error('Top route details resolver error:', error);
      return of(null);
    })
  );
};
