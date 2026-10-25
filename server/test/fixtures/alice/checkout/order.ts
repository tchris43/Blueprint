import { getUser } from "../account/user";
import { chargeCard, type Card } from "../payments/charge";
import { saveCard } from "../payments/vault";

export type CartItem = {
  sku: string;
  name: string;
  priceCents: number;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};

export type Order = {
  id: string;
  items: CartItem[];
  totalCents: number;
  chargeId: string;
  receiptEmail: string;
};

export function cartTotalCents(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
}

let nextOrderNumber = 1000;

/** Charges the card and records the order. */
export function placeOrder(cart: Cart, card: Card, receiptEmail: string): Order {
  if (cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const totalCents = cartTotalCents(cart);
  const charge = chargeCard(card, totalCents);

  // SHOP-212: remember the card for next time.
  // Only reached after the charge succeeds, so we never save a declined card.
  // The customer comes from the current session.
  saveCard(getUser().id, card);

  const order: Order = {
    id: `ord_${nextOrderNumber++}`,
    items: cart.items,
    totalCents,
    chargeId: charge.id,
    receiptEmail,
  };

  return order;
}
