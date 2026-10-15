import { ChangeDetectorRef, Component, DestroyRef, Inject, inject, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { BlogService } from '../../services/blog/blog.service';
import { TosterService } from '../../services/common/toaster.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { DatePipe, isPlatformBrowser, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '../../services/common/spinner.service';

@Component({
  selector: 'app-blog',
  imports: [DatePipe,NgIf],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {
private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
private blogService:BlogService=inject(BlogService)
private destroyRef:DestroyRef=inject(DestroyRef)
private toasterService:TosterService=inject(TosterService)
private router:Router=inject(Router)
  private SpinnerService: SpinnerService = inject(SpinnerService);
    private transferState: TransferState = inject(TransferState);
     private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly BLOG_KEY = makeStateKey<any>('blog');
  constructor(@Inject(PLATFORM_ID) private platformId: Object,){

  }
allBlog:any[]=[]
imageBasepath:string=environment.BLOG_IMAGE_BASE_PATH

   paginatedBlogs:any[] = [];
  currentPage = 1;
  blogsPerPage = 6;

  get totalPages(): number {
    return Math.ceil(this.allBlog.length / this.blogsPerPage);
  }

  get pageNumbers(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }
  getPlainText(html: string, limit: number = 100): any {
        if (!isPlatformBrowser(this.platformId)) return;

    const div = document.createElement('div');
    div.innerHTML = html || '';
    const text = div.textContent || div.innerText || '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  goToDetailPage(id: string): void {
    this.router.navigate(['/blog-details',id]);
  }
ngOnInit(){


 this.activatedRoute.data.subscribe(data => {
      console.log('Resolved route data:', data['blogData']);
      
      if (data['blogData']) {
        this.processBlogData(data['blogData']);
      } else {
        // Fallback to manual fetch if resolver failed
        this.activatedRoute.params.subscribe(params => {
        
            this.getAllBlog();
          
        });
      }
    });

}
getAllBlog(){
  this.SpinnerService.show();
  this.blogService.getAllBlog().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
    next:(res)=>{
       this.SpinnerService.hide();
      this.allBlog=res?.data
       this.updatePaginatedBlogs();
        this.cdr.detectChanges();
    },
    error:(err)=>{
       this.SpinnerService.hide();
      this.toasterService.showError("Something went wrong while fetching blog")
    }
  })
}

  private processBlogData(blogData: any) {
    if (blogData?.data) {
      this.allBlog = blogData.data;
      
      // Store in TransferState for client-server sync
      this.transferState.set(this.BLOG_KEY, this.allBlog);
       this.cdr.detectChanges();
      // Process the data
      // this.processBlogDetails();
      
      // Update meta tags and title
      // this.updateMetaTags();
    } else {
      console.log(blogData,"blogData---------");
      
      // Handle case where blog was not found
      // this.handleBlogNotFound();
    }
  }


updatePaginatedBlogs(): void {
  const start = (this.currentPage - 1) * this.blogsPerPage;
  const end = start + this.blogsPerPage;
  this.paginatedBlogs = this.allBlog.slice(start, end);
  if (this.paginatedBlogs.length > 0) {
    this.SpinnerService.hide();
  }
  this.cdr.detectChanges();
}

goToPage(page: any): void {
      if (!isPlatformBrowser(this.platformId)) return;

  if (page === '...') return; // ignore clicks on dots
  if (page < 1 || page > this.totalPages) return;

  this.currentPage = page;
  this.updatePaginatedBlogs();

  // ✅ Smooth scroll to top of blog section
  const blogSection = document.getElementById('blogSection');
  if (blogSection) {
    blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

previousPage(): void {
  this.goToPage(this.currentPage - 1);
}

nextPage(): void {
  this.goToPage(this.currentPage + 1);
}
get visiblePageNumbers(): (number | string)[] {
  const total = this.totalPages;
  const current = this.currentPage;
  const maxVisible = 3;
  const pages: (number | string)[] = [];

  // Always show first page
  pages.push(1);

  // Calculate sliding window
  let start = Math.max(current - Math.floor(maxVisible / 2), 2);
  let end = start + maxVisible - 1;

  if (end >= total) {
    end = total - 1;
    start = Math.max(end - maxVisible + 1, 2);
  }

  // Add left ellipsis
  if (start > 2) {
    pages.push('...');
  }

  // Add middle window
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Add right ellipsis
  if (end < total - 1) {
    pages.push('...');
  }

  // Always show last page
  if (total > 1) {
    pages.push(total);
  }

  return pages;
}



}
