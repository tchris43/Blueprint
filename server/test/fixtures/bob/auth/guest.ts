let guestEmail: string | undefined;

/** SHOP-219: starts a guest checkout that only knows the buyer's email. */
export function createGuestSession(email: string): void {
  guestEmail = email;
}

export function isGuestSession(): boolean {
  return guestEmail !== undefined;
}

export function endGuestSession(): void {
  guestEmail = undefined;
}
