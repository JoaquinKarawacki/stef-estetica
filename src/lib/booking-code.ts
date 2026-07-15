const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin caracteres ambiguos (0/O, 1/I)

export function generateBookingCode(): string {
  let suffix = "";
  for (let i = 0; i < 5; i++) {
    suffix += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `SV-${suffix}`;
}
