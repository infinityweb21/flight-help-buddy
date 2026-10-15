import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {

  constructor() { }
  secrectKey='$eyvhhdktee$ffehj9bjklal7je767893nnjsdhmksndf$wdfw#gdhkq@kfgdfgt'
  // Use environment variable in real app

// Encrypt function
encryptData(data: any): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), this.secrectKey).toString();
}

// Decrypt function (for later retrieval)
decryptData(encryptedData: string): any {
  const bytes = CryptoJS.AES.decrypt(encryptedData, this.secrectKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
}
