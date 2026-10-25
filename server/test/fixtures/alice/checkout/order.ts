import { chargeCard, type Card } from "../payments/charge";
import { saveCard } from "../payments/saveCard";
import { getUser } from "../account/user";

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

  const order: Order = {
    id: `ord_${nextOrderNumber++}`,
    items: cart.items,
    totalCents,
    chargeId: charge.id,
    receiptEmail,
  };

  saveCard(getUser().id, card);

  return order;
}
