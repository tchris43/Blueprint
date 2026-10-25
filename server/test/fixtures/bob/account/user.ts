export type User = {
  id: string;
  name: string;
  email: string;
};

let signedInUser: User | undefined;

export function signIn(user: User): void {
  signedInUser = user;
}

export function signOut(): void {
  signedInUser = undefined;
}

/** Returns the signed-in customer, or null for a guest. */
export function getUser(): User | null {
  return signedInUser ?? null;
}
