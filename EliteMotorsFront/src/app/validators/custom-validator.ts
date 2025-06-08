import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// === VALIDADOR DE DNI ===
export const dniValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (typeof value !== 'string') return { invalidDni: true };

  const patron = /^\d{8}[a-zA-Z]$/;
  if (!patron.test(value)) return { invalidDni: true };

  const letrasDNI = "TRWAGMYFPDXBNJZSQVHLCKE";
  const numero = parseInt(value.slice(0, -1), 10);
  const letra = value.slice(-1).toUpperCase();

  return letrasDNI[numero % 23] === letra ? null : { invalidDni: true };
};

// === USUARIO MÍNIMO 5 CARACTERES ===
export const usuarioValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  return typeof value === 'string' && value.length >= 5 ? null : { invalidUsuario: true };
};

// === PASSWORD MÍNIMO 6 CARACTERES ===
export const passwdValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  return typeof value === 'string' && value.length >= 6 ? null : { invalidPasswd: true };
};

// === NOMBRE MÍNIMO 4 CARACTERES ===
export const nombreValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  return typeof value === 'string' && value.length >= 4 ? null : { invalidNombre: true };
};

// === APELLIDOS: SOLO QUE SEA STRING ===
export const apellidosValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  return typeof control.value === 'string' ? null : { invalidApellidos: true };
};

// === TELÉFONO ESPAÑOL DE 9 DÍGITOS (con o sin +34) ===
export const telefonoValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  let value = control.value;
  if (typeof value !== 'string') return { invalidTelefono: true };

  value = value.replace(/\s+/g, "").replace(/-/g, "");
  const patron = /^(\+34)?\d{9}$/;

  return patron.test(value) ? null : { invalidTelefono: true };
};

// === EMAIL VÁLIDO ===
export const emailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/;
  return typeof value === 'string' && emailRegex.test(value) ? null : { invalidEmail: true };
};

// === DIRECCIÓN MÍNIMO 10 CARACTERES ===
export const direccionValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  return typeof value === 'string' && value.length >= 10 ? null : { invalidDireccion: true };
};
