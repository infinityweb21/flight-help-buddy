import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared/shared.service';
import { QuickContactComponent } from '../../components/quick-contact/quick-contact.component';

@Component({
  selector: 'app-about-us',
  imports: [QuickContactComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent implements OnInit {

  // ============================================
  // COMPANY DATA
  // ============================================

  private shareService: SharedService = inject(SharedService);

  companyName: string = '';
  phoneNumber: string = '';
  email: string = '';
  companyData: any;


  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(
    private meta: Meta,
    private title: Title,
    private route: ActivatedRoute
  ) {}


  // ============================================
  // ON INIT
  // ============================================

  ngOnInit(): void {

    // Get company data
    const data = this.shareService.getcompanyName();

    this.companyName = data?.companyName || '';
    this.phoneNumber = data?.phoneNumber || '';
    this.email = data?.email || '';

    this.companyData = data;


    // ============================================
    // META DATA
    // ============================================

    const metaTitle =
      this.route.snapshot.data['metaTitle'];

    const metaDescription =
      this.route.snapshot.data['metaDescription'];


    // ============================================
    // PAGE TITLE
    // ============================================

    if (metaTitle) {

      this.title.setTitle(metaTitle);

    }


    // ============================================
    // META DESCRIPTION
    // ============================================

    if (metaDescription) {

      this.meta.updateTag({
        name: 'description',
        content: metaDescription
      });

    }


    // ============================================
    // SEO KEYWORDS
    // ============================================

    this.meta.updateTag({
      name: 'keywords',
      content:
        'about us, travel experts, infinity travel, travel company, global travel, travel planning'
    });


    // ============================================
    // OPEN GRAPH
    // ============================================

    this.meta.updateTag({
      property: 'og:title',
      content:
        metaTitle ||
        'About Us - Infinity Travel'
    });

    this.meta.updateTag({
      property: 'og:description',
      content:
        metaDescription ||
        'Learn about Infinity Travel and our commitment to exceptional travel experiences.'
    });

    this.meta.updateTag({
      property: 'og:type',
      content: 'website'
    });


    // ============================================
    // TWITTER
    // ============================================

    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary'
    });

    this.meta.updateTag({
      name: 'twitter:title',
      content:
        metaTitle ||
        'About Us - Infinity Travel'
    });

    this.meta.updateTag({
      name: 'twitter:description',
      content:
        metaDescription ||
        'Learn about Infinity Travel and our commitment to exceptional travel experiences.'
    });

  }

}