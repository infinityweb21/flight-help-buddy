import { Component, inject } from '@angular/core';
import { MainFilterComponent } from '../../../components/main-filter/main-filter.component';
import { FlightsTabComponent } from '../../../components/main-filter/flights-tab/flights-tab.component';
import { TopDestinationsHeadComponent } from '../top-destinations-head/top-destinations-head.component';
import { TopDestinationsListComponent } from '../top-destinations-list/top-destinations-list.component';
import { HotelsTabComponent } from '../../../components/main-filter/hotels-tab/hotels-tab.component';
import { MapModule } from '../../../core/map/map.module';
import { SharedService } from '../../../services/shared/shared.service';

@Component({
  selector: 'app-sydney',
  imports: [TopDestinationsHeadComponent,TopDestinationsListComponent,MapModule],
  templateUrl: './sydney.component.html',
  styleUrl: './sydney.component.scss'
})
export class SydneyComponent {
lat: number = -33.8688;
lng: number = 151.2093;
 private shareService: SharedService = inject(SharedService);
    getData:any='';
    ngOnInit(){
      this.getData=this.shareService.getcompanyName();
    }
}
