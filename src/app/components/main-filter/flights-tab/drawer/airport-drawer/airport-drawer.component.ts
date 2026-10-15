import { NgTemplateOutlet, NgClass, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, SimpleChanges, TemplateRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AutoFocus } from 'primeng/autofocus';
@Component({
  selector: "app-airport-drawer",
  imports: [
    AutoCompleteModule,
    ReactiveFormsModule,
    NgTemplateOutlet,
    AutoFocus,
    NgClass,
  ],
  templateUrl: "./airport-drawer.component.html",
  styleUrl: "./airport-drawer.component.scss",
})
export class AirportDrawerComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() controlName = "";
  @Input() placeholder = "Select Airport";
  @Input() airports: any[] = [];
  @Input() submitted = false;
  @Output() search = new EventEmitter<any>();

  @Output() selected = new EventEmitter<any>();
  @Output() focus = new EventEmitter<void>();
  @Input() titleTemplate: TemplateRef<any> | null = null;
  @Output() close = new EventEmitter<void>();

  filterAirports(event: any) {
    this.search.emit(event); // emit to parent
  }

  onSelectAirport(airport: any) {
    this.formGroup.get(this.controlName)?.setValue(airport);
    const payload = {
      value: airport,
    };
    this.selected.emit(payload);
    this.close.emit();
  }

  onFocus() {
    this.focus.emit();
  }
  remove() {
    this.formGroup.get(this.controlName)?.setValue("");
    this.formGroup.get(this.controlName)?.markAsPristine();
    this.formGroup.get(this.controlName)?.markAsUntouched();
    this.formGroup.get(this.controlName)?.setValue("");
    this.formGroup.get(this.controlName)?.markAsPristine();
    this.formGroup.get(this.controlName)?.markAsUntouched();
  }
  allowOnlyLetters(event: KeyboardEvent) {
    const allowed = /^[a-zA-Z\s\-\./'()]$/;
    const char = event.key;
    if (!allowed.test(char)) {
      event.preventDefault();
    }
  }

  sanitizePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData("text") ?? "";
    const sanitized = pasted.replace(/[^a-zA-Z\s\-\./'()]/g, "");

    const control = this.formGroup.get(this.controlName);
    const newValue = sanitized;
    control?.setValue(newValue);
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }
  clearedOnce = false;

  textHighlighted = false;
  clickedOnce = false;

  highlightText(event: any) {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      setTimeout(() => {
        input.select(); // highlight full text
        this.textHighlighted = true;
        this.clickedOnce = false; // reset click tracker
      });
    }
  }

  handleClick(event: MouseEvent) {
    const input = event.target as HTMLInputElement;
    const control = this.formGroup.get(this.controlName);

    // If highlighted → clicking clears input
    if (this.textHighlighted) {
      control?.setValue("");
      this.textHighlighted = false;
      this.clickedOnce = false;

      setTimeout(() => input.focus(), 0);
      return;
    }

    this.clickedOnce = false;
  }

  clearIfHighlightedOnKey(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const control = this.formGroup.get(this.controlName);
    if (!input || !control || !input.value) return;

    const isAllSelected =
      input.selectionStart === 0 && input.selectionEnd === input.value.length;

    if (isAllSelected) {
      // Save the pressed key BEFORE clearing
      const key = event.key;

      const isTextOnly = /^[a-zA-Z\s]$/.test(key);
      event.preventDefault();

      // Clear old value
      control.setValue("");

      // Insert typed key
      if (key.length === 1 && isTextOnly) {
        control.setValue(key);
      }

      // Reset tracking states
      this.textHighlighted = false;
      this.clickedOnce = false;

      // Keep focus
      setTimeout(() => input.focus(), 0);
    }
  }

  //
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  isAndroid = false;
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isAndroid = /Android/i.test(navigator.userAgent);
    }
    console.log("formGroup",this.formGroup)
  }

  //

  isActive = false; // track if the wrapper should have class

  onInputClick() {
    this.isActive = true;
  }

  // Optionally, remove the class when input loses focus
  onInputBlur() {
    this.isActive = false;
  }

  
}
