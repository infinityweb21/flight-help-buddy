import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';


export const HotelInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/hotel')) {
    const cloned = req.clone({ withCredentials: true });
    return next(cloned);
  }
  return next(req);
};
