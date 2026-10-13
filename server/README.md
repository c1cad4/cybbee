# CybBee payment adapter

Prices approved by product owner: USD 10/month or USD 100/year. Assets: CicadaFarm SPL and native SOL on Solana mainnet. Recipient: `AHBz386tP36ZrABN7STzxV66u1f7CwnaqrFBnevb4ff8`. CicadaFarm mint: `9QLCEL7Xo9VTwgBeAYU1PWX7JJ8joKxQCYw3msjUpump`.

Install server dependencies with `python3 -m pip install -r server/requirements.txt`. TLS certificates are verified with the certifi trust bundle. Start `python3 server/main.py`, visit http://localhost:8773. Quote requests work without enabling sales. `CYBBEE_CHECKOUT_ENABLED=1` enables invoices, only after launching the promised Pro functionality, account-bound entitlements and commercial terms. This local adapter is not a deployed production checkout. Prices are for one prepaid term, with no recurring token withdrawal.

DEX Screener pools must use Solana and the exact base-token mint; known quote mints and positive liquidity are required. The highest-liquidity eligible pool supplies an indicative USD rate. Rounded-up atomic token amount uses on-chain CicadaFarm decimals or 9 decimals for native SOL. USD is a pricing denomination, not a dollar payment or guaranteed exchange execution. Low liquidity and volatile rates may make token amounts unstable. No invented/stale fallback rate is used; missing data stops invoicing. Quote fetch time is not the pool's last trading timestamp. Invoice fixes the amount for 15 minutes.

A random 32-byte reference binds each invoice. Verification requires finalized successful transaction, exact reference, expected time window, correct transfer program, recipient balance increase and sufficient amount. SPL verification also binds mint and token-account owner. Unique transaction signatures prevent reuse across invoices. The receipt endpoint does not yet grant a Pro entitlement. No private keys or signing, no funds transferred by the server. Wallet confirmation is required for every transfer; SOL also pays network fees.

`CYBBEE_SOLANA_RPC`: HTTPS RPC endpoint; default public mainnet may rate-limit. `CYBBEE_DATA_DIR`: private SQLite database location, excluded from Git. Production requires HTTPS, authenticated sessions, account-bound orders, server-side entitlements, rate limiting, replay protection, monitoring, backups and refund/term policy. Do not expose this local development server directly. API secrets remain in server environment variables.

Tests: `python3 -m unittest discover -s server/tests -v`. No actual mainnet payment has been sent. Before launch test end-to-end in a dedicated environment. On-device local UI is not a secure subscription gate.

Protocol: https://docs.solanapay.com/spec
