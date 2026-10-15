import { Component, inject, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-seat-preference-no-results',
  imports: [],
  templateUrl: './seat-preference-no-results.component.html',
  styleUrl: './seat-preference-no-results.component.scss'
})
export class SeatPreferenceNoResultsComponent implements OnInit {
  companyData: any;
  private sharedService: SharedService = inject(SharedService);

  ngOnInit(): void {
    this.companyData = this.sharedService.getcompanyName();
  }
}