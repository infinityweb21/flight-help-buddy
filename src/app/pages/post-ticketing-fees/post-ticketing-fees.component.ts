import { Component, OnInit,inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { SharedService } from '../../services/shared/shared.service';
@Component({
  selector: 'app-post-ticketing-fees',
  imports: [],
  templateUrl: './post-ticketing-fees.component.html',
  styleUrl: './post-ticketing-fees.component.scss'
})
export class PostTicketingFeesComponent implements OnInit {

private sharedService:SharedService=inject(SharedService)
public companyname:any
  constructor(
    private meta: Meta,
    private title: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

     this.companyname= this.sharedService.getcompanyName()
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
    this.meta.updateTag({ name: 'keywords', content: 'post-ticketing fees, flight change fees, refund charges, rebooking fees, airline fees, travel costs' });
    this.meta.updateTag({ property: 'og:title', content: metaTitle || 'Post-Ticketing Fees - Infinity Travel' });
    this.meta.updateTag({ property: 'og:description', content: metaDescription || 'Learn about post-ticketing fees including refunds, rebooking, and other charges.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: metaTitle || 'Post-Ticketing Fees - Infinity Travel' });
    this.meta.updateTag({ name: 'twitter:description', content: metaDescription || 'Learn about post-ticketing fees including refunds, rebooking, and other charges.' });
  }
}
