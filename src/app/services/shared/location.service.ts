// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { firstValueFrom } from 'rxjs';
// import { environment } from '../../../environments/environment';
// import { Inject,  PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// @Injectable({
//   providedIn: 'root',
// })
// export class LocationService {
//   private airportsUrl = environment.API_URL;

//   constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: any) {}

//   /** Get exact location with address (tries geolocation → falls back to IP) */
//   public async getExactLocation(): Promise<{
//     latitude: number;
//     longitude: number;
//     address: string | null;
//   }> {
//     try {
//       // 1️⃣ Try browser geolocation
//       const coords = await this.getUserCoordinates();
//       const address = await this.getAddressFromCoordinates(coords.latitude, coords.longitude);

//       return {
//         latitude: coords.latitude,
//         longitude: coords.longitude,
//         address,
//       };
//     } catch (geoError) {
//       console.warn('Geolocation access denied or failed, falling back to IP location.', geoError);

//       // 2️⃣ Fallback to IP-based location
//       try {
//         const ipData = await this.getLocationFromIP();
//         if (ipData) {
//           const address = await this.getAddressFromCoordinates(ipData.latitude, ipData.longitude);
//           return {
//             latitude: ipData.latitude,
//             longitude: ipData.longitude,
//             address: address || ipData.city || 'Unknown location',
//           };
//         }
//       } catch (ipError) {
//         console.error('IP location fallback failed', ipError);
//       }

//       // ❌ No static fallback — just throw an error now
//       throw new Error('Unable to determine your location.');
//     }
//   }

//   /** Get browser coordinates */
//   private getUserCoordinates(): Promise<{ latitude: number; longitude: number }> {
//     return new Promise((resolve, reject) => {
//           if (!isPlatformBrowser(this.platformId)) {
//       reject('Geolocation not supported on SSR');
//       return;
//     }


//       if (!navigator.geolocation) {
//         reject('Geolocation not supported.');
//         return;
//       }

//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           resolve({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (error) => reject(error),
//         { enableHighAccuracy: true, timeout: 10000 }
//       );
//     });
//   }

//   /** Fallback: Get approximate location using IP address */
// private async getLocationFromIP(): Promise<{ latitude: number; longitude: number; city?: string } | null> {
//   try {
//     const response = await fetch('https://ipwho.is/');
//     const data = await response.json();

//     if (data && data.latitude && data.longitude) {
//       return {
//         latitude: data.latitude,
//         longitude: data.longitude,
//         city: data.city,
//       };
//     }

//     console.warn('Invalid IP response, stopping here.');
//     return null; 
//   } catch (err) {
//     console.error('Failed to fetch IP-based location (stopping):', err);
//     return null; 
//   }
// }


//   /** Reverse geocode coordinates to address (Google → OpenStreetMap fallback) */
//   private async getAddressFromCoordinates(lat: number, lng: number): Promise<any> {
    
//     try {
//         if (!isPlatformBrowser(this.platformId)) {
      
//       return;
//     }
//       const googleResponse = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.GOOGLE_API_KEY}`
//       );
//       const googleData = await googleResponse.json();

//       if (googleData.status === 'OK' && googleData.results.length > 0) {
//         return googleData.results[0].formatted_address;
//       }
//     } catch (err) {
//       console.warn('Google geocoding failed', err);
//     }

//     // Fallback to OpenStreetMap
//     try {
//       const osmResponse = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//       );
//       const osmData = await osmResponse.json();

//       if (osmData && osmData.display_name) {
//         return osmData.display_name;
//       }
//     } catch (err) {
//       console.error('Nominatim fallback failed', err);
//     }

//     return null;
//   }

//   /** Get nearest airport using coordinates */
//   async getNearestAirport() {
//         if (!isPlatformBrowser(this.platformId)) {
      
//       return;
//     }
//     try {
//       const { latitude, longitude } = await this.getExactLocation();

//       const params = new HttpParams()
//         .set('lat', latitude.toString())
//         .set('lng', longitude.toString());

//       const response: any = await firstValueFrom(
//         this.http.get(`${this.airportsUrl}${environment.AIRPORT_LIST}`, { params })
//       );

//       if (response.data) {
//         return response.data[0];
//       }

//       return null;
//     } catch (error) {
//       console.error('Error getting nearest airport:', error);
//       throw error;
//     }
//   }
// }


import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, firstValueFrom, from, map, Observable, of, switchMap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private airportsUrl = environment.API_URL;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  /** Get location ONLY from IP (No GPS, No Google API) */
  public async getExactLocation(): Promise<{
    latitude: number;
    longitude: number;
    address: string;
  }> {
    const ipData = await this.getLocationFromIP();

    if (!ipData) {
      throw new Error('Unable to determine location from IP');
    }

    return {
      latitude: ipData.latitude,
      longitude: ipData.longitude,
      address: `${ipData.city}, ${ipData.region}, ${ipData.country}`,
    };
  }

  /** IP-based location using ipinfo */
  private async getLocationFromIP(): Promise<{
    latitude: number;
    longitude: number;
    city: string;
    region: string;
    country: string;
  } | null> {
    try {
      if (!isPlatformBrowser(this.platformId)) return null;

      // 🔹 OPTION 1: ipinfo.io
      const response = await fetch('https://ipinfo.io/json?token=55ef8c9025e516');
      const data = await response.json();

      if (data?.loc) {
        const [lat, lng] = data.loc.split(',');

        return {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          city: data.city,
          region: data.region,
          country: data.country,
        };
      }

      return null;
    } catch (err) {
      console.error('IPINFO failed:', err);
      return null;
    }
  }

  /** Get nearest airport */
getNearestAirport(): Observable<any> {

  return from(this.getExactLocation()).pipe(
    switchMap(({ latitude, longitude }) => {

      const params = new HttpParams()
        .set('lat', latitude.toString())
        .set('lng', longitude.toString());

      return this.http.get(`${this.airportsUrl}${environment.AIRPORT_LIST}`, { params });
    }),
    map((response: any) => response?.data?.[0] || null),
    catchError((err) => {
      console.error('Error getting nearest airport:', err);
      return of(null);
    })
  );
}
}