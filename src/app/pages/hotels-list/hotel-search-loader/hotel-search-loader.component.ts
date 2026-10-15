import { Component, inject } from '@angular/core';
import { SharedService } from '../../../services/shared/shared.service';

@Component({
  selector: 'app-hotel-search-loader',
  imports: [],
  templateUrl: './hotel-search-loader.component.html',
  styleUrl: './hotel-search-loader.component.scss'
})
export class HotelSearchLoaderComponent {
   private shareService: SharedService = inject(SharedService);
    getData:any='';
    ngOnInit(){
      this.getData=this.shareService.getcompanyName();
    }
}
