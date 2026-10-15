import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-thankyou',
  imports: [RouterLink],
  templateUrl: './thankyou.component.html',
  styleUrl: './thankyou.component.scss',
})
export class ThankyouComponent {
  public shareService: SharedService = inject(SharedService);
  getData: any = '';
companyname: any;
  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
  }
}
