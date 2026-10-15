import { Component, inject } from '@angular/core';
import { SharedService } from '../../../services/shared/shared.service';

@Component({
  selector: 'app-flight-search-loader',
  imports: [],
  templateUrl: './flight-search-loader.component.html',
  styleUrl: './flight-search-loader.component.scss'
})
export class FlightSearchLoaderComponent {
  private shareService: SharedService = inject(SharedService);
    getData:any='';
    ngOnInit(){
      this.getData=this.shareService.getcompanyName();
    }
}
