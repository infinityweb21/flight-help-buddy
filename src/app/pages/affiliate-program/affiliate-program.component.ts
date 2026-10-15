import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared/shared.service';
@Component({
  selector: 'app-affiliate-program',
  imports: [],
  templateUrl: './affiliate-program.component.html',
  styleUrl: './affiliate-program.component.scss'
})
export class AffiliateProgramComponent implements OnInit {
  companyData: any;

  private sharedService: SharedService = inject(SharedService);

  constructor(
    private meta: Meta,
    private title: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    // =========================================
    // Meta Data
    // =========================================

    const metaTitle = this.route.snapshot.data['metaTitle'];
    const metaDescription = this.route.snapshot.data['metaDescription'];

    // Set page title
    if (metaTitle) {
      this.title.setTitle(metaTitle);
    }

    // Set meta description
    if (metaDescription) {
      this.meta.updateTag({
        name: 'description',
        content: metaDescription
      });
    }

    // =========================================
    // Company Data
    // =========================================

    this.companyData = this.sharedService.getcompanyName();

    console.log(
      'copafasfoaifj----------',
      this.companyData
    );

    // =========================================
    // Additional SEO Meta Tags
    // =========================================

    this.meta.updateTag({
      name: 'keywords',
      content: ''
    });

    this.meta.updateTag({
      property: 'og:title',
      content: metaTitle || 'Affiliate Program - Infinity Travel'
    });

    this.meta.updateTag({
      property: 'og:description',
      content: metaDescription || ''
    });

    this.meta.updateTag({
      property: 'og:type',
      content: 'website'
    });

    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary'
    });

    this.meta.updateTag({
      name: 'twitter:title',
      content: metaTitle || 'Affiliate Program - Infinity Travel'
    });

    this.meta.updateTag({
      name: 'twitter:description',
      content: metaDescription || ''
    });

    // =========================================
    // FAQ Collapse
    // =========================================

    setTimeout(() => {

      const faqAnswers = document.querySelectorAll('.faq-answer');

      faqAnswers.forEach((collapse) => {

        const faqItem = collapse.closest('.faq-item');

        if (!faqItem) {
          return;
        }

        // Check initial open state
        if (collapse.classList.contains('show')) {
          faqItem.classList.add('is-open');
        }

        // Bootstrap Collapse - Open
        collapse.addEventListener(
          'shown.bs.collapse',
          () => {
            faqItem.classList.add('is-open');
          }
        );

        // Bootstrap Collapse - Close
        collapse.addEventListener(
          'hidden.bs.collapse',
          () => {
            faqItem.classList.remove('is-open');
          }
        );

      });

    });

  }
}

