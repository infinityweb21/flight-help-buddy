import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { register } from 'swiper/element/bundle';
import * as Sentry from "@sentry/angular";
import { environment } from './environments/environment';

Sentry.init({
  dsn: "https://774ca87b3baa77dbaab9c1ee04da12f6@o4510034680217600.ingest.us.sentry.io/4510465484259328",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  environment:environment.environment

});
bootstrapApplication(AppComponent, appConfig)
.catch((err) => console.error(err));

register();