# Demo: two clean changes that break when merged

Two patches, each one passes `tsc` alone. Merged, they fail, and git reports no conflict.

- `bob-guest-checkout.patch` (SHOP-219): `getUser()` now returns `User | null` for
  guests. Also updates `requireLogin()` so Bob's change compiles alone.
- `alice-saved-cards.patch` (SHOP-212): adds `payments/saveCard.ts` and calls
  `saveCard(getUser().id, card)` in `placeOrder()` (`checkout/order.ts:47`).

## Run it (PowerShell, from the demo-shop folder)

These live in the Blueprint repo, not demo-shop, so the demo agents never see the planned conflict
(and `reset-demo.sh` can't delete them). Paths assume demo-shop sits next to Blueprint.

    git apply ../Blueprint/docs/demo-patches/bob-guest-checkout.patch;  npx tsc --noEmit   # passes
    git checkout -- .

    git apply ../Blueprint/docs/demo-patches/alice-saved-cards.patch;   npx tsc --noEmit   # passes
    git checkout -- .; git clean -fd payments

    git apply ../Blueprint/docs/demo-patches/bob-guest-checkout.patch; git apply ../Blueprint/docs/demo-patches/alice-saved-cards.patch
    npx tsc --noEmit
    # checkout/order.ts(47,12): error TS2531: Object is possibly 'null'.

Undo afterwards: `git checkout -- .; git clean -fd payments`
