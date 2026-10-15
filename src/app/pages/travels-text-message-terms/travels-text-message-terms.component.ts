import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-travels-text-message-terms',
  imports: [],
  templateUrl: './travels-text-message-terms.component.html',
  styleUrl: './travels-text-message-terms.component.scss',
})
export class TravelsTextMessageTermsComponent {
  private sharedService: SharedService = inject(SharedService);
  getData: any;
  ngOnInit(): void {
    this.getData = this.sharedService.getcompanyName();
  }
}
