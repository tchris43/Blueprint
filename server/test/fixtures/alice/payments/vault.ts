import type { Card } from "./charge";

export type SavedCard = {
  userId: string;
  token: string;
  last4: string;
  expMonth: number;
  expYear: number;
};

const savedCards: SavedCard[] = [];
let nextToken = 1;

/** SHOP-212: keeps a card for next time. Never stores the full number or CVC. */
export function saveCard(userId: string, card: Card): SavedCard {
  const saved: SavedCard = {
    userId,
    token: `tok_${nextToken++}`,
    last4: card.number.slice(-4),
    expMonth: card.expMonth,
    expYear: card.expYear,
  };
  savedCards.push(saved);
  return saved;
}

export function listSavedCards(userId: string): SavedCard[] {
  return savedCards.filter((saved) => saved.userId === userId);
}
