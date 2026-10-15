import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-cookies',
  imports: [RouterLink],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss'
})
export class CookiesComponent {
showMore: boolean = false;
shareService:SharedService=inject(SharedService)
toggleMoreText(): void {
  this.showMore = !this.showMore;
}
isAcceptCookies(){
      this.shareService.acceptCookies();

}
}
