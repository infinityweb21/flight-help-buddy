import { Component, inject } from '@angular/core';
import { MainFilterComponent } from '../../../components/main-filter/main-filter.component';
import { SearchService } from '../../../services/search.service';
import { TopHotelListComponent } from '../top-hotel-list/top-hotel-list.component';
import { MapModule } from '../../../core/map/map.module';
import { SharedService } from '../../../services/shared/shared.service';

@Component({
  selector: 'app-dubai',
  imports: [MainFilterComponent,TopHotelListComponent,MapModule],
  templateUrl: './dubai.component.html',
  styleUrl: './dubai.component.scss'
})
export class DubaiComponent {
  private searchService: SearchService = inject(SearchService);
 lat: number = 25.276987;
 lng: number = 55.296249;

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
          displayName: 'Dubai - United Arab Emirates',
          cityid: 800035326,

        }  
      ,
   
     departDate:this.formatDate(sendDate),
     arriveDate: this.formatDate(arriveDate),
   }
   console.log("sdhs",routeData)
this.searchService.setHotelRouteData(routeData);

}

 
}
