import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-testimonials',
  imports: [],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent implements OnInit {
 private sharedService :SharedService= inject(SharedService);
 companyData:any;
  constructor(
    private meta: Meta,
    private title: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Set meta tags
     this.companyData=this.sharedService.getcompanyName();
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
    this.meta.updateTag({ name: 'keywords', content: 'customer testimonials, travel reviews, flight booking reviews, hotel reviews, cruise reviews, traveler stories' });
    this.meta.updateTag({ property: 'og:title', content: metaTitle || 'Customer Testimonials - Infinity Travel' });
    this.meta.updateTag({ property: 'og:description', content: metaDescription || 'Read honest reviews from travelers about their booking experiences with flights, hotels, and cruises.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: metaTitle || 'Customer Testimonials - Infinity Travel' });
    this.meta.updateTag({ name: 'twitter:description', content: metaDescription || 'Read honest reviews from travelers about their booking experiences with flights, hotels, and cruises.' });
  }
}
