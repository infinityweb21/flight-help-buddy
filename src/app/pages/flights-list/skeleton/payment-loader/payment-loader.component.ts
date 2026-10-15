import { Component } from '@angular/core';
import { LottieComponent, provideLottieOptions,AnimationOptions } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory() { return player; }

@Component({
  selector: "app-payment-loader",
  imports: [LottieComponent],
  templateUrl: "./payment-loader.component.html",
  styleUrl: "./payment-loader.component.scss",
})
export class PaymentLoaderComponent {
  options: AnimationOptions = {
    path: "assets/lottie/payment-loader.json",
    loop: true,
    autoplay: true,
  };
}
