import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-disclaimer',
  imports: [],
  templateUrl: './disclaimer.component.html',
  styleUrl: './disclaimer.component.scss'
})
export class DisclaimerComponent implements OnInit {

  constructor(
    private meta: Meta,
    private title: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Set meta tags
    const metaTitle = this.route.snapshot.data['metaTitle'];
    const metaDescription = this.route.snapshot.data['metaDescription'];

    // Set title
    if (metaTitle) {
      this.title.setTitle(metaTitle);
    }

    // Set meta description
    if (metaDescription) {
      this.meta.updateTag({ name: 'description', content: metaDescription });
    }

    // Set additional meta tags for better SEO
    this.meta.updateTag({ name: 'keywords', content: 'travel disclaimer, terms and conditions, travel policies, infinity travel disclaimer, travel guidance, legal information' });
    this.meta.updateTag({ property: 'og:title', content: metaTitle || 'Travel Disclaimer - Infinity Travel' });
    this.meta.updateTag({ property: 'og:description', content: metaDescription || 'Read our travel disclaimer to understand our policies and how we guide your travel journey.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: metaTitle || 'Travel Disclaimer - Infinity Travel' });
    this.meta.updateTag({ name: 'twitter:description', content: metaDescription || 'Read our travel disclaimer to understand our policies and how we guide your travel journey.' });
  }
}
