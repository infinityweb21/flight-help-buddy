import { Component, inject, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-checked-luggage-sizes',
  imports: [],
  templateUrl: './checked-luggage-sizes.component.html',
  styleUrl: './checked-luggage-sizes.component.scss'
})
export class CheckedLuggageSizesComponent implements OnInit {
  companyData: any;
  private sharedService: SharedService = inject(SharedService);

  ngOnInit(): void {
    this.companyData = this.sharedService.getcompanyName();
  }
}
