export function validateEmail(email: string): boolean {
  return /.+@.+\..+/.test(email)
}

export function validatePassword(password: string): boolean {
  return password.length >= 6
}

export function validateOTP(otp: string): boolean {
  return /^[0-9]{6}$/.test(otp)
}


