import { Injectable, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

 private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  addOrganizationSchema() {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip on server-side
    }

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';

    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Infinity Travels",
      "url": "https://infinitytravels.com/",
      "logo": "https://infinitytravels.com/assets/images/logo-black.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "1 (800) 645-3851",
        "contactType": "customer service",
        "areaServed": ["US", "CA"],
        "availableLanguage": "en"
      },
      "sameAs": [
        "https://www.facebook.com/theinfinitytravels.us/",
        "https://x.com/infinitytravelU",
        "https://www.instagram.com/infinitytravels.us/",
        "https://www.youtube.com/@infinitytravelsusa",
        "https://www.linkedin.com/company/infinitytravels"
      ]
    };

    script.text = JSON.stringify(schema);
    this.renderer.appendChild(document.head, script);
  }
}
