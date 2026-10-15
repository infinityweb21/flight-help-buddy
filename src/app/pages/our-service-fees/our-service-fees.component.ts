import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-our-service-fees',
  imports: [],
  templateUrl: './our-service-fees.component.html',
  styleUrl: './our-service-fees.component.scss'
})
export class OurServiceFeesComponent implements OnInit {
   private shareService: SharedService = inject(SharedService);
    getData:any='';
companyname: any = this.shareService.getcompanyName();
  constructor(
    private meta: Meta,
    private title: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
          this.getData=this.shareService.getcompanyName();

    // Get meta data from route
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
    this.meta.updateTag({ name: 'keywords', content: 'travel service fees, booking fees, flight fees, hotel fees, cruise fees, car hire fees, travel costs, transparency' });
    this.meta.updateTag({ property: 'og:title', content: metaTitle || 'Understand Our Travel Service Fees | Infinity Travel' });
    this.meta.updateTag({ property: 'og:description', content: metaDescription || 'View booking fee details for all services - flights, hotels, car hires, and cruises. Plan smarter by knowing exactly how much you\'re being charged.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: metaTitle || 'Understand Our Travel Service Fees | Infinity Travel' });
    this.meta.updateTag({ name: 'twitter:description', content: metaDescription || 'View booking fee details for all services - flights, hotels, car hires, and cruises. Plan smarter by knowing exactly how much you\'re being charged.' });
  }
}
