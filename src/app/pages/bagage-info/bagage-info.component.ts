import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared/shared.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { SpinnerService } from '../../services/common/spinner.service';
import { API_PROVIDERS } from './bagage.airline';

@Component({
  selector: 'app-bagage-info',
  imports: [FormsModule,CommonModule],

  templateUrl: './bagage-info.component.html',
  styleUrl: './bagage-info.component.scss'
})
export class BagageInfoComponent implements OnInit {
   private shareService: SharedService = inject(SharedService);
 private destroyRef: DestroyRef = inject(DestroyRef);
  imageUrl: string = environment.imageUrl;
   private SpinnerService: SpinnerService = inject(SpinnerService);
private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  airlineSearch: string = '';
  staticdata: any = '';

  // Full data
  allAirlineData = [];

  // Filtered lists
  filteredPopularAirlines: any[] = [];
  filteredOtherAirlines: any[] = [];

  // Show More logic
  limitPopular = 5;
  limitOther = 5;

  showAllPopular = false;
  showAllOther = false;
popularAirlineCodes: string[] = [
  'AC', // Air Canada
  'UA', // United Airlines
  'AA', // American Airlines
  'B6', // JetBlue
  'NK', // Spirit Airlines
  'F9', // Frontier Airlines
  'WS', // WestJet
  'EK', // Emirates
  'EY', // Etihad Airways
  'WN', // Southwest Airlines
  'AS', // Alaska Airlines
  'TK', // Turkish Airlines
  'QR', // Qatar Airways
  'SY', // Sun Country Airlines
  'BA'  // British Airways
];
  ngOnInit(): void {
this.getAirline();
  }

getAirline() {

     this.staticdata = API_PROVIDERS;
      const data = this.staticdata?.FlightItinerary || [];
        this.allAirlineData = data;
        this.categorizeAirlines(data);
        this.cdr.detectChanges();
}
categorizeAirlines(data: any[]) {

  this.filteredPopularAirlines = data.filter(a =>
    this.popularAirlineCodes.includes(a.id)
  );

  this.filteredOtherAirlines = data.filter(a =>
    !this.popularAirlineCodes.includes(a.id)
  );
}
onSearchChange() {
  const value = this.airlineSearch.toLowerCase();

  const data = this.staticdata?.FlightItinerary || [];

  const filtered = data.filter((a: any) =>
    a.airlineName.toLowerCase().includes(value)
  );

  this.categorizeAirlines(filtered);
}

  // Visible data (for show more)
  get visiblePopularAirlines() {
    return this.showAllPopular
      ? this.filteredPopularAirlines
      : this.filteredPopularAirlines.slice(0, this.limitPopular);
  }

  get visibleOtherAirlines() {
    return this.showAllOther
      ? this.filteredOtherAirlines
      : this.filteredOtherAirlines.slice(0, this.limitOther);
  }

  togglePopular() {
    this.showAllPopular = !this.showAllPopular;
  }

  toggleOther() {
    this.showAllOther = !this.showAllOther;
  }

  onImgError(event: any) {
  event.target.src = this.imageUrl+'/uploads/airlines/thumbnail_airline.png';
}
}
