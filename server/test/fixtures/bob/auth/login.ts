import { getUser, type User } from "../account/user";

export class NotSignedInError extends Error {
  constructor() {
    super("Please sign in to continue");
    this.name = "NotSignedInError";
  }
}

/** Call at the top of any page that needs a signed-in customer. */
export function requireLogin(): User {
  const user = getUser();
  if (!user) {
    throw new NotSignedInError();
  }
  return user;
}
