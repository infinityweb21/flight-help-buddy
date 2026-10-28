import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-site-map',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './site-map.component.html',
  styleUrl: './site-map.component.scss'
})
export class SiteMapComponent {
  private shareService: SharedService = inject(SharedService);
  getData: any = '';

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
  }
}
