import { Component, DestroyRef, inject } from '@angular/core';
import { MainFilterComponent } from '../../../components/main-filter/main-filter.component';
import { BlogService } from '../../../services/blog/blog.service';
import { TosterService } from '../../../services/common/toaster.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';
import { CommonModule, DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SpinnerService } from '../../../services/common/spinner.service';
import { Title, Meta } from '@angular/platform-browser';
// import { TransferState, makeStateKey } from '@angular/platform-browser';
import {TransferState, makeStateKey } from '@angular/core';

@Component({
  selector: 'app-blog-details',
  imports: [MainFilterComponent,DatePipe,CommonModule,RouterLink],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.scss'
})
export class BlogDetailsComponent {
  private blogService: BlogService = inject(BlogService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private toasterService: TosterService = inject(TosterService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private spinnerService: SpinnerService = inject(SpinnerService);
  private titleService: Title = inject(Title);
  private metaService: Meta = inject(Meta);
  private transferState: TransferState = inject(TransferState);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  blogDetails: any;
  imageBasePath: string = environment.BLOG_IMAGE_BASE_PATH;
  descriptionSafe!: SafeHtml;
  faqList: any[] = [];

  // TransferState key for caching blog data
  private readonly BLOG_KEY = makeStateKey<any>('blog-details');

  ngOnInit() {
    // First, try to get data from resolved route data
    this.activatedRoute.data.subscribe(data => {
      console.log('Resolved route data:', data['blogData']);
      
      if (data['blogData']) {
        
        this.processBlogData(data['blogData']);
    
      } else {
        // Fallback to manual fetch if resolver failed
        this.activatedRoute.params.subscribe(params => {
          if (params['id']) {
            this.getBlogDetails(params['id']);
          }
        });
      }
    });
  }


  private processBlogData(blogData: any) {
    if (blogData?.data) {
      this.blogDetails = blogData.data;
      
      // Store in TransferState for client-server sync
      this.transferState.set(this.BLOG_KEY, this.blogDetails);
      
      // Process the data
      this.processBlogDetails();
      
      // Update meta tags and title
    } else {
      console.log(blogData,"blogData---------");
      
      // Handle case where blog was not found
      // this.handleBlogNotFound();
    }
  }

  private processBlogDetails() {
    try {
      this.faqList = this.blogDetails.faq ? JSON.parse(this.blogDetails.faq) : [];
    } catch (error) {
      console.warn('Error parsing FAQ JSON:', error);
      this.faqList = [];
    }
    
    this.descriptionSafe = this.sanitizer.bypassSecurityTrustHtml(this.blogDetails.description || '');
  }



  private handleBlogNotFound() {
    this.toasterService.showError("Blog not found");
    // Optionally redirect to blog list or 404 page
    this.router.navigate(['/blog']);
  }

  getBlogDetails(slug: any) {
    // Check TransferState first (for client-side hydration)
    const cachedData = this.transferState.get(this.BLOG_KEY, null);
    if (cachedData) {
      this.blogDetails = cachedData;
      this.processBlogDetails();
      return;
    }

    this.spinnerService.show();
    this.blogService.getBlogDetails(slug).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res?.data) {
          this.processBlogData(res);
        } else {
          this.handleBlogNotFound();
        }
      },
      error: (err) => {
        this.spinnerService.hide();
        this.toasterService.showError("Something went wrong while fetching blog");
        console.error('Blog fetch error:', err);
      }
    });
  }
}
