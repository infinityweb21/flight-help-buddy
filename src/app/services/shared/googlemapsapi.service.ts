import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GooglemapsapiService {
 private loaded = false;

  load(): Promise<void> {
    return new Promise((resolve) => {

      if (this.loaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');

      script.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyBvTpp4DWc3TbXXo6NwD7ubnbksZaFW1Xk&amp;libraries=places';

      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.loaded = true;
        resolve();
      };

      document.body.appendChild(script);
    });
  }
}