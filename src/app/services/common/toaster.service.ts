import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TosterService {
  constructor(private toastr: ToastrService) { }

  // Method to show success message
  showSuccess(message: string) {
    this.toastr.success(message);
  }

  // Method to show error message
  showError(message: string) {
    this.toastr.error(message);
  }

  // Method to show info message
  showInfo(message: string) {
    this.toastr.info(message);
  }

  // Method to show warning message
  showWarning(message: string) {
    this.toastr.warning(message);
  }

  clearAll() {
    this.toastr.clear();
  }
}
