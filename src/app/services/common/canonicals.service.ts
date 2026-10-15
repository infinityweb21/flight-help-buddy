// src/app/services/canonical.service.ts
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CanonicalsService {

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  setCanonicalURL(url?: string) {
    const head = this.doc.head;
    let element: HTMLLinkElement | null = this.doc.querySelector("link[rel='canonical']");

    if (!element) {
      element = this.doc.createElement('link');
      element.setAttribute('rel', 'canonical');
      head.appendChild(element);
    }

    element.setAttribute('href', url || this.doc.URL);
  }
}
