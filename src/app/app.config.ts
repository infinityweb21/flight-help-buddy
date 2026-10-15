import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, UrlSerializer, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideToastr } from 'ngx-toastr'; // Import ToastrModule
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { routes } from './app.routes';
import { spinnerInterceptor } from './interceptors/spinner.interceptor';
import { definePreset } from '@primeng/themes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { sessionInterceptor } from './interceptors/session.interceptor';
import { APP_INITIALIZER,  ErrorHandler, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import * as Sentry from "@sentry/angular";
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web'; 
import { CustomUrlSerializer } from './core/url/custom-url-serializer';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { apiKeyInterceptor } from './interceptors/apikey.interceptor';
import { providerInterceptor } from './interceptors/providerheader.interceptor';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#FFF8E7',
            100: '#FFEFC9',
            200: '#FFE39A',
            300: '#FFD76B',
            400: '#FFCC3F',
            500: '#FBB040', 
            600: '#E29D32',
            700: '#C78828',
            800: '#A6711F',
            900: '#875B17',
            950: '#3F2C08'
        }
    }
});


export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }), 
        provideRouter(routes, withEnabledBlockingInitialNavigation()), 
        provideAnimationsAsync(), 
        provideHttpClient(withInterceptors([providerInterceptor,sessionInterceptor,spinnerInterceptor])),
        provideAnimations(),
        provideToastr(),
        providePrimeNG({
            theme: {
                preset: MyPreset,
                options: {
                    darkModeSelector: false || 'none'
                }
            }
        }), 
         provideClientHydration(withEventReplay()),
        provideLottieOptions({ player: () => player }),
        {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler(),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    { provide: UrlSerializer, useClass: CustomUrlSerializer }, 
     provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production
    }),
  
    ]
};
