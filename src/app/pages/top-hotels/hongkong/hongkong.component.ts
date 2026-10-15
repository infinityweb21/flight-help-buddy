import { Component, inject } from '@angular/core';
import { MainFilterComponent } from '../../../components/main-filter/main-filter.component';
import { SearchService } from '../../../services/search.service';
import { TopHotelListComponent } from '../top-hotel-list/top-hotel-list.component';
import { MapModule } from '../../../core/map/map.module';
import { SharedService } from '../../../services/shared/shared.service';


@Component({
  selector: 'app-hongkong',
  imports: [MainFilterComponent,TopHotelListComponent,MapModule],
  templateUrl: './hongkong.component.html',
  styleUrl: './hongkong.component.scss'
})
export class HongkongComponent {
  private searchService: SearchService = inject(SearchService);
 lat: number = 48.8566;
 lng: number = 2.3522;

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
          displayName: 'Paris - United States',
          cityid: 800000747,

        }
      ,
   
     departDate:this.formatDate(sendDate),
     arriveDate: this.formatDate(arriveDate),
   }
   console.log("sdhs",routeData)
this.searchService.setHotelRouteData(routeData);

}

 
}
