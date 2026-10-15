import { Component, inject, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cancellation-policy',
  imports: [],
  templateUrl: './cancellation-policy.component.html',
  styleUrl: './cancellation-policy.component.scss',
})
export class CancellationPolicyComponent implements OnInit {
  private shareService: SharedService = inject(SharedService);
  getData: any = '';
  constructor(
    private meta: Meta,
    private title: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Set meta tags
    this.getData = this.shareService.getcompanyName();
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
    this.meta.updateTag({
      name: 'keywords',
      content:
        'cancellation policy, flight cancellation, travel refund, booking modification, travel insurance, cancellation fees',
    });
    this.meta.updateTag({
      property: 'og:title',
      content: metaTitle || 'Cancellation Policy - Infinity Travel',
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        metaDescription ||
        'Learn about our flexible cancellation guidelines and how to modify your travel bookings.',
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({
      name: 'twitter:title',
      content: metaTitle || 'Cancellation Policy - Infinity Travel',
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content:
        metaDescription ||
        'Learn about our flexible cancellation guidelines and how to modify your travel bookings.',
    });
  }
}
