import { Component, inject, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-booking-in-progress',
  imports: [],
  templateUrl: './booking-in-progress.component.html',
  styleUrl: './booking-in-progress.component.scss'
})
export class BookingInProgressComponent implements OnInit {
  companyData: any;
  private sharedService: SharedService = inject(SharedService);

  ngOnInit(): void {
    this.companyData = this.sharedService.getcompanyName();
  }
}