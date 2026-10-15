import {
  Directive,
  Input,
  HostListener,
  forwardRef
} from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
@Directive({
  selector: '[appValidate]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CommonValidatorDirective),
      multi: true
    }
  ]
})
export class CommonValidatorDirective implements Validator {
   @Input('appValidate') type!: 'name' | 'email' | 'number' | 'city'| 'common'|'middleName'|'frequentFlayer';

private emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/u;


  // 🔥 Works on real mobile keyboards
  @HostListener('beforeinput', ['$event'])
  onBeforeInput(event: InputEvent) {
  // 🔥 SAFETY: Do not block focus event on mobile
  if (event.inputType === 'insertCompositionText') return;
  if (event.inputType === 'insertFromPaste') return;
  if (!event.data) return;

    const char = event.data;
    if (!char) return;
      console.log("event fire",event)

      // ❌ Block emojis everywhere
    if (this.emojiRegex.test(char)) {
      event.preventDefault();
      return;
    }
      console.log("event fire",event)

    if (this.type === 'city') {
      // Only letters, numbers, space
      if (!/^[A-Za-z0-9 ]$/.test(char)) {
        event.preventDefault();
      }
    }
  if (this.type === 'frequentFlayer') {
  if (!/^[A-Za-z0-9]$/.test(char)) {
    event.preventDefault();
  }
}
    
if (this.type === 'common') {
  // allow A-Z, a-z, 0–9, space
  if (!/^[A-Za-z0-9 ]$/.test(char)) {
    event.preventDefault();
  }
}
  // ✅ NAME + MIDDLE NAME → Only Letters + Space
    if (this.type === 'middleName') {
      if (!/^[A-Za-z ]$/.test(char)) {
        event.preventDefault();
      }
    }
    if (this.type === 'name') {
      if (!/^[A-Za-z ]$/.test(char)) event.preventDefault();
    }

    if (this.type === 'email') {
      if (!/^[A-Za-z0-9@._\-+]$/.test(char)) event.preventDefault();
    }

    if (this.type === 'number') {
      if (!/^[0-9]$/.test(char)) event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])


   onInput(event: any) {

    let value = event.target.value;

    // ❌ Remove Emojis
    value = value.replace(this.emojiRegex, '');

    // ❌ Remove Starting Spaces
    value = value.replace(/^\s+/, '');

    // ❌ Remove Double Spaces
    value = value.replace(/\s{2,}/g, ' ');

    // ✅ If Only Spaces → Make Empty
    if (value.trim().length === 0) {
      value = '';
    }

    (event.target as HTMLInputElement).value = value;
  }

//   validate(control: AbstractControl): ValidationErrors | null {
//     if (!control.value) return null;

//     const value = control.value.trim();
//     if (value.length === 0) return { whitespace: true };

//     if (this.type === 'name') {
//       const nameRegex = /^[A-Za-z]+(\s[A-Za-z]+)*$/;
//       if (!nameRegex.test(value)) return { invalidName: true };
//     }

//     if (this.type === 'email') {
//       const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
//       if (!emailRegex.test(value)) return { invalidEmail: true };
//     }

//     if (this.type === 'number') {
//       const numberRegex = /^[0-9]+$/;
//       if (!numberRegex.test(value)) return { invalidNumber: true };
//     }
//      // CITY VALIDATION HERE ⬇⬇⬇
//     if (this.type === 'city') {
//       const cityRegex =
//         /^(?!.*[\p{Extended_Pictographic}])[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/u;

//       if (!cityRegex.test(value)) return { invalidCity: true };
//     }
// if (this.type === 'common') {
//   const commonRegex = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/;
//   if (!commonRegex.test(value)) return { invalidCommon: true };
// }

//     return null;
//   }
validate(control: AbstractControl): ValidationErrors | null {

  if (control.value === null || control.value === undefined) {
    return null;
  }

  const rawValue = String(control.value);
  const trimmedValue = rawValue.trim();

  // =====================================================
  // ✅ OPTIONAL FIELDS (middleName + common)
  // If user deletes everything or only spaces → VALID
  // =====================================================
  if (this.type === 'middleName' || this.type === 'common') {
    if (trimmedValue.length === 0) {
      return null; // ✅ no error
    }
  }

  // =====================================================
  // ❌ REQUIRED/STRICT FIELDS
  // If only spaces → ERROR
  // =====================================================
  if (
    this.type === 'name' ||
    this.type === 'city' ||
    this.type === 'email' ||
    this.type === 'number'||
    this.type==='frequentFlayer'
  ) {
    if (trimmedValue.length === 0) {
      return { whitespace: true }; // ❌ error
    }
  }

  // =====================================================
  // ✅ NAME Validation
  // =====================================================
  if (this.type === 'name') {
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(trimmedValue)) {
      return { invalidName: true };
    }
  }

  // =====================================================
  // ✅ MIDDLE NAME Validation (Optional)
  // =====================================================
  if (this.type === 'middleName') {
    const middleRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!middleRegex.test(trimmedValue)) {
      return { invalidMiddleName: true };
    }
  }

  // =====================================================
  // ✅ EMAIL Validation
  // =====================================================
  if (this.type === 'email') {
    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(trimmedValue)) {
      return { invalidEmail: true };
    }
  }

  // =====================================================
  // ✅ NUMBER Validation
  // =====================================================
  if (this.type === 'number') {
    const numberRegex = /^[0-9]+$/;
    if (!numberRegex.test(trimmedValue)) {
      return { invalidNumber: true };
    }
  }

  // =====================================================
  // ✅ CITY Validation
  // =====================================================
  if (this.type === 'city') {
    const cityRegex = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/;
    if (!cityRegex.test(trimmedValue)) {
      return { invalidCity: true };
    }
  }
if (this.type === 'frequentFlayer') {
   const cityRegex = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/;
    if (!cityRegex.test(trimmedValue)) {
      return { invalidfrequentFlayer: true };
    }
 
}
  // =====================================================
  // ✅ COMMON Validation (Optional)
  // =====================================================
  if (this.type === 'common') {
    const commonRegex = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/;
    if (!commonRegex.test(trimmedValue)) {
      return { invalidCommon: true };
    }
  }

  return null;
}
}
