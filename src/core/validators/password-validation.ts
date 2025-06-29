import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordValidatorService {
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check minimum length
    if (password.length < 6) {
      errors.push('Passwords must be at least 6 characters.');
    }

    // Check for non-alphanumeric character
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('Passwords must have at least one non alphanumeric character.');
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push("Passwords must have at least one lowercase ('a'-'z').");
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push("Passwords must have at least one uppercase ('A'-'Z').");
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}
