import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { BlogService } from '../services/blog/blog.service';
import { catchError, of } from 'rxjs';

export const blogResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
  const blogService = inject(BlogService);
 

  return blogService.getAllBlog().pipe(
    catchError((error) => {
      console.error('Blog  resolver error:', error);
      return of(null);
    })
  );
};