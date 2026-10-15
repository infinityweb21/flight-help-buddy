import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared/shared.service';
@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
    private shareService: SharedService = inject(SharedService);
  companyName: string = '';
  phoneNumber: string = '';
  email: string = '';
  companyData: any;
   ngOnInit(): void {

    // Get company data
    const data = this.shareService.getcompanyName();

    this.companyName = data?.companyName || '';
    this.phoneNumber = data?.phoneNumber || '';
    this.email = data?.email || '';

    this.companyData = data;
   }
}
