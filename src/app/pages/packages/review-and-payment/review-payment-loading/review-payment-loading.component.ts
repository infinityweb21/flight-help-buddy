import { Component, input } from '@angular/core';

@Component({
  selector: 'app-review-payment-loading',
  imports: [],
  templateUrl: './review-payment-loading.component.html',
  styleUrl: './review-payment-loading.component.scss'
})
export class ReviewPaymentLoadingComponent {
  /** Show or hide the processing loader */
  open = input<boolean>(false);

  /** Texts (override from the parent if needed) */
  title = input<string>('Processing payment');
  message = input<string>("Please wait and don't close or refresh this page.");

  /** Font Awesome icon shown inside the spinner */
  icon = input<string>('fa-solid fa-credit-card');
}