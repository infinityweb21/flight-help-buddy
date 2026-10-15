import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [RouterLink],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss'
})
export class TermsAndConditionsComponent implements OnInit {
  private shareService: SharedService = inject(SharedService);
  getData: any = '';
 companyname: any = this.shareService.getcompanyName();
  constructor(
    private meta: Meta,
    private title: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  this.getData = this.shareService.getcompanyName();
   this.companyname = this.getData.companyName;
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
    this.meta.updateTag({ name: 'keywords', content: 'terms and conditions, user agreement, website terms, legal terms, user rights, responsibilities' });
    this.meta.updateTag({ property: 'og:title', content: metaTitle || 'Terms and Conditions - Infinity Travel' });
    this.meta.updateTag({ property: 'og:description', content: metaDescription || 'Read our terms and conditions to understand your rights and responsibilities when using our website.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: metaTitle || 'Terms and Conditions - Infinity Travel' });
    this.meta.updateTag({ name: 'twitter:description', content: metaDescription || 'Read our terms and conditions to understand your rights and responsibilities when using our website.' });
  }
   ngAfterViewInit(): void {
  this.route.queryParams.subscribe(params => {
    const section = params['section'];

    if (section) {
      setTimeout(() => {
        const element = document.getElementById(section);

        if (element) {
          const headerOffset = 120; // adjust to your header height
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;

          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  });
}
}
