import { Component, inject, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/common/spinner.service';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { SharedService } from '../../services/shared/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent implements OnInit {
  diparture:string='';
  arrival:string='';
   private shareService: SharedService = inject(SharedService);
    getData:any='';
 flightLoading = false;
  hotelLoading = false;
  private subscription: Subscription;
  portName:any='';
constructor(public spinnerService: SpinnerService,private searchService:SearchService){
  this.subscription = this.spinnerService.flightLoading$.subscribe(
      (loading) => {
        this.flightLoading = loading;
      }
    );
      this.subscription = this.spinnerService.hotelLoading$.subscribe(
      (loading) => {
        this.hotelLoading = loading;
      }
    );
}
ngOnInit(): void {
        this.getData=this.shareService.getcompanyName();
  this.searchService.searchData$.subscribe((searchData) => {
    if (searchData) {
      if (searchData.tripType !== 'multicity') {
        console.log("searchData.OriginDestination[0].DepartureLocationCode",searchData.OriginDestination[0].DepartureLocationCode)
        this.diparture = searchData.OriginDestination[0].DepartureLocationCode.code;
        this.arrival = searchData.OriginDestination[0].ArrivalLocationCode.code;
      } else if (searchData.tripType === 'multicity') {
        const lastIndex = searchData.OriginDestination.length - 1;
                console.warn("searchData",lastIndex)

        this.diparture = searchData.OriginDestination[0].DepartureLocationCode.code;
        this.arrival = searchData.OriginDestination[lastIndex].ArrivalLocationCode.code;
      }
    }
  });
    this.searchService.cruiseSearchData$.subscribe((searchData) => {
    if (searchData) {
      this.portName=searchData?.departureCruises?.name;
     
    }
  });
}
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
