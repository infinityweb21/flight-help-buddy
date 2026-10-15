import { Component, inject } from '@angular/core';
import { MainFilterComponent } from '../../../components/main-filter/main-filter.component';
import { SearchService } from '../../../services/search.service';
import { TopHotelListComponent } from '../top-hotel-list/top-hotel-list.component';
import { MapModule } from '../../../core/map/map.module';
import { SharedService } from '../../../services/shared/shared.service';

@Component({
  selector: 'app-rome',
  imports: [MainFilterComponent,TopHotelListComponent,MapModule],
  templateUrl: './rome.component.html',
  styleUrl: './rome.component.scss'
})
export class RomeComponent {
  private searchService: SearchService = inject(SearchService);
 lat: number = 41.9028;
 lng: number = 12.4964;

  private shareService: SharedService = inject(SharedService);
     getData:any='';
constructor(){
   
}
 formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
ngOnInit():void{
         this.getData=this.shareService.getcompanyName();
const today = new Date();

const sendDate = new Date(today.getTime()); 
sendDate.setDate(sendDate.getDate() + 15);

const arriveDate = new Date(today.getTime());
arriveDate.setDate(arriveDate.getDate() + 17);
const routeData={
      mainData:
       {
          displayName: 'Romeno - Italy',
          cityid: 800042888,

        }
      ,
   
     departDate:this.formatDate(sendDate),
     arriveDate: this.formatDate(arriveDate),
   }
   console.log("sdhs",routeData)
this.searchService.setHotelRouteData(routeData);

}

 
}
