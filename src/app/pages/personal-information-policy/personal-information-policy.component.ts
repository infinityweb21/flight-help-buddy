import { Component, inject } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-personal-information-policy',
  imports: [],
  templateUrl: './personal-information-policy.component.html',
  styleUrl: './personal-information-policy.component.scss',
})
export class PersonalInformationPolicyComponent {
  private sharedService: SharedService = inject(SharedService);
  getData: any;
  ngOnInit(): void {
    this.getData = this.sharedService.getcompanyName();
  }
}
