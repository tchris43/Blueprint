import type { Card } from "./charge";

export type SavedCard = { last4: string; expMonth: number; expYear: number; token: string };

const savedCards = new Map<string, SavedCard[]>();

export function saveCard(userId: string, card: Card): void {
  const list = savedCards.get(userId) ?? [];
  list.push({ last4: card.number.slice(-4), expMonth: card.expMonth, expYear: card.expYear, token: `tok_${list.length + 1}` });
  savedCards.set(userId, list);
}
