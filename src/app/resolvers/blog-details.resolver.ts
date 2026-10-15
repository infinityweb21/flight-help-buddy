import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, of, map } from 'rxjs';
import { BlogService } from '../services/blog/blog.service';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

export const blogDetailsResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const blogService = inject(BlogService);
  const titleService = inject(Title);
  const metaService = inject(Meta);
  const id = route.paramMap.get('id'); // Blog ID from URL
  const imageBasePath = environment.BLOG_IMAGE_BASE_PATH || '';
  if (!id) {
    return of(null);
  }

  return blogService.getBlogDetails(id).pipe(
    map((res: any) => {
      const matched = res || null;

      if (matched?.data) {
        // SSR meta update
        const title = matched?.data.s_url
          ? matched.data.s_url
              .split('-') // break into words
              .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each
              .join(' ')
          : 'Blog Details | Infinity Travels';
        const description = matched?.data.metadescription || '';
        const keywords = matched?.data.metakeywords || '';
        const imageUrl = matched?.data.thumb
          ? imageBasePath + matched?.data.thumb
          : '';
        const currentUrl = `${'https://infinitytravels.com'}${state.url}`;

        titleService.setTitle(title);

        metaService.updateTag({ name: 'title', content: title });
        metaService.updateTag({ property: 'og:title', content: title });
        metaService.updateTag({ name: 'keywords', content: keywords });

        if (description) {
          metaService.updateTag({ name: 'description', content: description });
          metaService.updateTag({
            property: 'og:description',
            content: description,
          });
        }

        if (imageUrl) {
          metaService.updateTag({ property: 'og:image', content: imageUrl });
        }

        metaService.updateTag({ property: 'og:url', content: currentUrl });
        metaService.updateTag({ rel: 'canonical', href: currentUrl });
      }

      return matched;
    }),
    catchError((error) => {
      console.error('Blog details resolver error:', error);
      return of(null);
    })
  );
};
