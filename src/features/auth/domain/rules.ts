import type { LoginRequest, RegisterRequest } from "@/features/auth/domain/auth";

const EMAIL_PATTERN =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

const NOMBRE_PATTERN = /^[\p{L}][\p{L}\s'.-]*$/u;

export type AuthFieldErrors = {
  nombre?: string;
  email?: string;
  password?: string;
  form?: string;
};

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function validateRegister(input: RegisterRequest): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  const nombre = input.nombre.trim();

  if (nombre.length < 2 || nombre.length > 80) {
    errors.nombre = "El nombre debe tener entre 2 y 80 caracteres.";
  } else if (!NOMBRE_PATTERN.test(nombre)) {
    errors.nombre = "El nombre solo puede contener letras, espacios, apóstrofos, puntos y guiones.";
  }

  const emailError = validateEmail(input.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(input.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

export function validateLogin(input: LoginRequest): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  const emailError = validateEmail(input.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(input.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

export function authErrorsFromMessage(message: string): AuthFieldErrors {
  if (message.startsWith("El nombre")) {
    return { nombre: message };
  }

  if (message.startsWith("El correo")) {
    return { email: message };
  }

  if (message.startsWith("La contraseña")) {
    return { password: message };
  }

  return { form: message };
}

export function hasAuthErrors(errors: AuthFieldErrors): boolean {
  return Object.values(errors).some((value) => value !== undefined);
}

function validateEmail(value: string): string | null {
  const email = normalizeEmail(value);

  if (email.length === 0) {
    return "El correo es obligatorio.";
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return "El correo no tiene un formato válido.";
  }

  return null;
}

function validatePassword(value: string): string | null {
  if (value.length === 0) {
    return "La contraseña es obligatoria.";
  }

  if (value.length < 8 || value.length > 72) {
    return "La contraseña debe tener entre 8 y 72 caracteres.";
  }

  return null;
}
