import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-price-match-promise',
  imports: [],
  templateUrl: './price-match-promise.component.html',
  styleUrl: './price-match-promise.component.scss',
})
export class PriceMatchPromiseComponent {
  private sharedService: SharedService = inject(SharedService);
  getData: any;
  ngOnInit(): void {
    this.getData = this.sharedService.getcompanyName();
  }
}
