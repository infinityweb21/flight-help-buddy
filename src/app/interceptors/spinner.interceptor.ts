import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { inject, PLATFORM_ID } from '@angular/core';
import { SpinnerService } from '../services/common/spinner.service';
import { isPlatformBrowser } from '@angular/common';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  function getPath(url: string): string {
    const u = url.toLowerCase().replace(/^https?:\/\/[^/]+/, '');
    return u.split('?')[0].split('#')[0];
  }

  const path = getPath(req.url);
  const url = req.url.toLowerCase();

  // Skip spinner for these endpoints
  if (
    url.includes('/api/flight/all_routes') ||
    url.includes('/api/flight/all_cruise_line') ||
    url.includes('/api/flight/all_blogs') ||
    url.includes('/api/flight/blog_details') ||
    url.includes('/api/flight/route') ||
    url.includes('/api/flight/cruise_line') ||
    url.includes('/api/v1/trawex/cruise-port-line') ||
    url.includes('/api/flight/deals') ||
    url.includes('/api/flight/deals-details/') ||
    url.includes('/api/flight/top_destination') ||
    url.includes('/api/v1/all/airport-list-lat-long/')||
    url.includes('/api/v1/all/common-flight-reprice')||
    url.includes('/api/v1/all/common-flight-list')||
    url.includes('/api/v2/all/common-flight-list')||
    url.includes('/api/flight/createbooking')||
    url.includes('/api/v1/mondee/flight-book')||
    url.includes('/api/flight/generateeticketpdf/')||
    url.includes('/api/v1/mobileapp/common-flight-generateeticketpdf')||
    url.includes('/api/v1/all/common-flight-book' )||
    url.includes('/index.php/api/flight/lead')||
    url.includes('/api/v1/all/webcheckin-airline')||
    url.includes('/api/v2/hotels/search-hotel-city-list')||
    url.includes('/api/v1/all/city-list')||
    url.includes('/api/v1/all/airport-list')||
    url.includes('/api/v1/hotels/hotel-details')||
    url.includes('/api/v1/hotels/hotel-list')||
    url.includes('api/v1/hotels/search-hotel-city-list')||
    url.includes('cruise/save_lead')
  ) {
    return next(req);
  }

  // Helper to safely lock scroll
  const lockScroll = () => {
    if (isBrowser) document.body.style.overflow = 'hidden';
  };
  const unlockScroll = () => {
    if (isBrowser) document.body.style.overflow = '';
  };

  // Flight list
  if (url.includes('/api/v1/mondee/flight-list')) {
    spinnerService.setLoading(true);
    lockScroll();
  } else if (path === '/api/v1/mondee/hotel-list') {
    spinnerService.setHotelLoading(true);
    lockScroll();
  } else if (path === '/api/v1/trawex/cruise-list') {
    spinnerService.setHotelLoading(true);
    lockScroll();
  }

  // Existing logic
  if (url.includes('all/flights-hotels-cruise-list')) {
    spinnerService.showLoader('package');
    lockScroll();
  } else if (url.includes('hotel')) {
    spinnerService.showLoader('hotel', req.body);
    lockScroll();
  } else if (url.includes('flight') && !url.includes('/api/flight/deal_details/') && !url.includes('/api/flight/top_destination')) {
    spinnerService.showLoader('flight');
    lockScroll();
  } else if (
    url.includes('cruise-list') ||
    url.includes('trawex/cruise') 
    
  ) {
    spinnerService.showLoader('cruise');
    lockScroll();
  }
  else if (
    url.includes('trawex-car') ||
    url.includes('/index.php/api/flight/lead') 
   
  ) {
    spinnerService.showLoader('car');
    lockScroll();
  }

  return next(req).pipe(
    finalize(() => {
      spinnerService.hideLoader();
      unlockScroll();

      if (url.includes('/api/v1/mondee/flight-list')) {
        spinnerService.setLoading(false);
      } else if (path === '/api/v1/mondee/hotel-list') {
        spinnerService.setHotelLoading(false);
      } else if (path === '/api/v1/trawex/cruise-list') {
        spinnerService.setHotelLoading(false);
      }
    })
  );
};
