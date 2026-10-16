# CybBee Pro payment lifecycle

1. Sign into the ChatGPT account that should own Pro. The subscription is account-based, not wallet-based.
2. Optionally connect the injected Phantom or Solflare provider. Only the public Solana address is read, only after a click. No seed/private key is requested, no message or transaction is signed by this connection, and the address is not stored on the server.
3. Select 30 days ($10) or 365 days ($100), paid once in SOL or CicadaFarm on Solana mainnet. No automatic renewal. The server computes token units with integer arithmetic and freezes a new invoice for 15 minutes. Network fees are extra.
4. Open the invoice's Solana Pay link in a compatible wallet and approve the transfer there. Connecting the injected wallet does not itself execute this transfer. On mobile, use a compatible wallet browser or a wallet supporting Solana Pay links.
5. Return and choose automatic payment discovery. The server searches up to ten finalized transactions mentioning the invoice's unique reference, then validates the transfer. Manual signature verification remains available. There is no background polling or claim of instant finality.
6. The server verifies recipient, token mint, actual received amount, time window and unique invoice reference. Account isolation and unique transaction signature prevent reuse. A transaction must be finalized. Failed or merely confirmed transfers grant no access.
7. Invoice and entitlement changes are atomic. A repeat verification is idempotent. Renewal adds 30/365 days after the later of current expiry and the current time.
8. The UI refreshes entitlement after successful verification. The season-report endpoint checks the authenticated account and expiry on every request. The browser cannot unlock it by changing its UI or local storage. On another device, sign into the same account. An invoice paid within its time window can be verified later.

## Current paid feature

The seasonal JSON report summarizes the synchronized journal: hives, inspections, completed tasks and expense totals separately by currency. The local journal, exported personal data and basic tools remain free. This is not a promise that all future AI or hardware features are included.

## Launch status

Production checkout is still disabled (`CHECKOUT_ENABLED` must equal `1` to create new invoices). No real funds were sent during development. Before enabling, perform a controlled end-to-end mainnet payment with the owner's wallet, confirm the destination and CicadaFarm mint, and verify entitlement/report access from a second signed-in device. RPC availability and wallet link handling need real-device verification. Refunds and late transfers outside the invoice window need manual support; do not pay an expired invoice.

## References

- https://docs.phantom.com/solana/integrating-phantom
- https://docs.solanapay.com/spec
- https://solana.com/ru/docs/rpc/http/getsignaturesforaddress

## Version 47: payment screen reliability

The account panel distinguishes free, expired and active access and offers a server status refresh. A payment link arms one reference lookup on return to the visible app (focus/visibility events). It does not run continuous background polling. Concurrent or repeated reference lookups for the selected invoice are bounded by a 20-second client cooldown; server rate limits still apply. Switching invoice or leaving the page disposes the timer and event handlers and ignores in-flight responses for the old view.

A one-second local display timer hides an unpaid invoice link at its expiry; clicking also rechecks expiry. It performs no network request. Verification remains available for transfers already sent within the original payment window. Manual signature entry is under a disclosure. New payment instructions and state messages have ten translations. Local QA uses synthetic invoices and no funds. A narrow browser viewport showed no horizontal overflow; this is not a physical-device wallet test.
