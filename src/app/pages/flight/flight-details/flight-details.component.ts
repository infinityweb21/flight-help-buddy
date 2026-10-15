import { Component, inject } from '@angular/core';
import { SharedService } from '../../../services/shared/shared.service';

@Component({
  selector: 'app-flight-details',
  imports: [],
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.scss'
})
export class FlightDetailsComponent {
  private shareService: SharedService = inject(SharedService);
  getData: any = "";
  constructor(){
        this.getData = this.shareService.getcompanyName();

  }
}
