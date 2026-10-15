import { Component, inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { MainFilterComponent } from '../../../components/main-filter/main-filter.component';
import { FlightsTabComponent } from '../../../components/main-filter/flights-tab/flights-tab.component';
import { TopDestinationsHeadComponent } from '../top-destinations-head/top-destinations-head.component';
import { TopDestinationsListComponent } from '../top-destinations-list/top-destinations-list.component';
import { HotelsTabComponent } from '../../../components/main-filter/hotels-tab/hotels-tab.component';
import { MapModule } from '../../../core/map/map.module';
import { SharedService } from '../../../services/shared/shared.service';

@Component({
  selector: 'app-new-york',
  imports: [TopDestinationsHeadComponent,TopDestinationsListComponent,MapModule],
  templateUrl: './new-york.component.html',
  styleUrl: './new-york.component.scss',
  schemas:[NO_ERRORS_SCHEMA]
})
export class NewYorkComponent {
lat: number = 40.7128;
lng: number = -74.0060;
 private shareService: SharedService = inject(SharedService);
    getData:any='';
    ngOnInit(){
      this.getData=this.shareService.getcompanyName();
    }
}
