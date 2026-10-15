import { Component, HostListener, inject, Inject, PLATFORM_ID, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { RouteListenerService } from './services/shared/route-listner.service';
import { RouteListnerHotelService } from './services/shared/route-listner-hotel.service';
import { RouteListnerCarService } from './services/shared/route-listner-car.service';
import { CommonListnerService } from './services/shared/common-listner.service';
import { SeoService } from './services/seo.service';
import { CanonicalsService } from './services/common/canonicals.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Carousel } from 'primeng/carousel';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { Meta } from '@angular/platform-browser';
import { filter, map, mergeMap, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'the-infinity-travel';
  
  // Inject services clean syntax
  private routeListener = inject(RouteListenerService);
  private commonListner = inject(CommonListnerService);
  private hotelListner = inject(RouteListnerHotelService);
  private carListner = inject(RouteListnerCarService);
  private canonicalService = inject(CanonicalsService);
  private swUpdate = inject(SwUpdate);
  private router = inject(Router);
  private seoService = inject(SeoService);
  private meta = inject(Meta);
  private route = inject(ActivatedRoute);
  private renderer = inject(Renderer2);

  private readonly baseUrl = 'https://infinitytravels.com';
  private readonly MOBILE_BREAKPOINT = 992;
  private readonly remindAfter = 5 * 60 * 1000; // 5 minutes
  
  private isMobileView!: boolean;
  private currentUpdateHash: string | null = null;
  private serviceWorkerInterval: any;
  private mainRouterSubscription: Subscription = new Subscription();
  
  deferredPrompt: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('beforeinstallprompt', (e: any) => {
        e.preventDefault();
        this.deferredPrompt = e;
      });
      this.isMobileView = window.innerWidth <= this.MOBILE_BREAKPOINT;
    }
    
    // Override PrimeNG Carousel swipe default behaviors if targeted
    Carousel.prototype.onTouchMove = () => {};
  }

  ngOnInit() {
    this.seoService.addOrganizationSchema();

    // Consolidated single reactive subscription stream for routing lifecycle management
    this.mainRouterSubscription.add(
      this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        
        // 1. Manage SSR-safe window coordinates resets
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }

        // 2. Conditional Google Ads Trigger logic evaluation
        if (event.urlAfterRedirects === '/thankyou') {
          this.triggerGoogleAdsConversion();
        }

        // 3. Keep canonical targets synced with application layout states
        const canonicalUrl = `${this.baseUrl}${event.urlAfterRedirects}`;
        this.canonicalService.setCanonicalURL(canonicalUrl);
        this.updateHrefLangTags(event.urlAfterRedirects);
        this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
      })
    );

    // Dynamic Data-driven metadata binding cycle
    this.mainRouterSubscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route),
        map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        const metaTitle = data['metaTitle'] || 'Flighthelpbuddy – Book Flights & Hotels';
        const metaDescription = data['metaDescription'] || 'Book flights, hotels, and travel deals in one place.';

        this.meta.updateTag({ name: 'keywords', content: 'travel, flights, hotels, cruises, booking, vacation, travel deals' });
        this.meta.updateTag({ property: 'og:title', content: metaTitle });
        this.meta.updateTag({ property: 'og:description', content: metaDescription });
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ property: 'og:locale', content: 'en_US' });
        this.meta.updateTag({ property: 'og:image', content: 'assets/images/logo-dark.png' });
        this.meta.updateTag({ property: 'og:site_name', content: 'Flighthelpbuddy' }); // Fixed 'og:site_nam' typo
        this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
        this.meta.updateTag({ name: 'twitter:site', content: '@infinitytravelU' });
        this.meta.updateTag({ name: 'twitter:domain', content: 'https://x.com/infinitytravelU' });
        this.meta.updateTag({ name: 'twitter:title', content: metaTitle });
        this.meta.updateTag({ name: 'twitter:description', content: metaDescription });
      })
    );

    // Safe handling system for background ServiceWorker cache tasks
    if (isPlatformBrowser(this.platformId) && this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate();

      this.mainRouterSubscription.add(
        this.swUpdate.versionUpdates.subscribe(event => {
          if (event.type === 'VERSION_READY') {
            const readyEvent = event as VersionReadyEvent;
            if (this.currentUpdateHash !== readyEvent.latestVersion.hash) {
              this.currentUpdateHash = readyEvent.latestVersion.hash;
              this.askForUpdate();
            }
          }
        })
      );

      // Checked balance frequency optimization window (Adjusted from 10s to 5m)
      this.serviceWorkerInterval = setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 5 * 60 * 1000);
    }
  }

  private askForUpdate(): void {
    const reload = confirm('A new version of the site is available. Reload now for the latest experience?');
    if (reload) {
      this.swUpdate.activateUpdate().then(() => {
        if (isPlatformBrowser(this.platformId)) {
          window.location.reload();
        }
      });
    } else {
      setTimeout(() => {
        if (this.currentUpdateHash) {
          this.askForUpdate();
        }
      }, this.remindAfter);
    }
  }

  // FIXED: No longer adding and stripping heavy script structures out of DOM tree. 
  // Runs via explicit, ad-blocker guarded global execution calls.
  private triggerGoogleAdsConversion(): void {
    if (isPlatformBrowser(this.platformId) && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-11465126480/-uaBCLmho50bENDk_9oq',
        'value': 1.0,
        'currency': 'USD',
        'transaction_id': ''
      });
    } else {
      console.warn('Google Analytics event blocked or execution contextual environment missing.');
    }
  }

  private updateHrefLangTags(currentPath: string): void {
    const oldTags = this.document.querySelectorAll('link[rel="alternate"]');
    oldTags.forEach(tag => this.renderer.removeChild(this.document.head, tag));

    const hreflangs = [
      { lang: 'en-us', url: `${this.baseUrl}${currentPath}` },
      { lang: 'en', url: `${this.baseUrl}${currentPath}` },
      { lang: 'x-default', url: `${this.baseUrl}${currentPath}` }
    ];

    hreflangs.forEach(tag => {
      const link: HTMLLinkElement = this.renderer.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', tag.lang);
      link.setAttribute('href', tag.url);
      this.renderer.appendChild(this.document.head, link);
    });
  }

  @HostListener('window:resize', [])
  // onResize(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const currentView = window.innerWidth < this.MOBILE_BREAKPOINT;
  //     if (currentView !== this.isMobileView) {
  //       this.isMobileView = currentView;
  //       // Optimization Note: avoid hard logic forces via window.location.reload() here. 
  //       // Allow components to adapt responsively via CSS breakpoints or structural layout properties.
  //     }
  //   }
  // }
    onResize(): void {
    if (isPlatformBrowser(this.platformId)) {

      const currentView = window.innerWidth < this.MOBILE_BREAKPOINT;

      if (currentView !== this.isMobileView) {
        this.isMobileView = currentView;
        window.location.reload();
      }
    }
  }

  ngOnDestroy(): void {
    this.mainRouterSubscription.unsubscribe();
    if (this.serviceWorkerInterval) {
      clearInterval(this.serviceWorkerInterval);
    }
  }
}