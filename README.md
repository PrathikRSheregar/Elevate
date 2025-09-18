# Offline UPI Lite Payment Simulation

Domain: SaaS

## Project Overview
This project simulates UPI Lite, a small-value offline payment system introduced by NPCI, which allows users to make payments even when they or the merchant are offline. Transactions are stored locally and synchronized with the bank once internet connectivity is available. An official UTR (Unique Transaction Reference) is generated upon successful reconciliation.

## Features
- Offline Transactions: Users can make small payments without internet.
- Preloaded Wallet: Users preload up to ₹2000 for offline use.
- Sync with Bank Later: Transactions reconcile automatically when devices go online.
- Secure Payments: Transaction status and UTR are updated only after bank confirmation.

## Payment Flow
1. **Wallet Top-up**
   - Customer preloads their UPI Lite wallet online.
   - Backend/bank records wallet balance for offline transactions.

2. **Offline Payment**
   - Customer makes payment offline (PIN verification).
   - Wallet balance is deducted locally.
   - A provisional transaction ID is generated.

3. **Offline Record Storage**
   - Merchant app also stores provisional transaction details if offline:
     - Order ID
     - Amount
     - Customer VPA
     - Provisional UTR

4. **Sync with Backend**
   - Once internet is available, customer or merchant app uploads offline transactions to backend.
   - Backend marks transactions as pending reconciliation.

5. **Bank Reconciliation**
   - Backend sends transaction request to bank.
   - Bank deducts amount from official wallet and generates official UTR.
   - Backend updates both customer and merchant transaction status to `paid`.

6. **Confirmation**
   - Customer sees updated wallet balance and official UTR.
   - Merchant sees payment status updated and official UTR.

## API Endpoints
- **Create Order**
  - `POST /orders`
  - Body: `{ "customer_name": "Alice", "amount_cents": 15000 }`

- **Record Offline UPI Attempt**
  - `POST /upi-attempts`
  - Body:
    ```
    {
      "order_id": "<ORDER_ID>",
      "device_id": "device-1",
      "method": "upi_lite",
      "declared_amount_cents": 15000,
      "provisional_txn_id": "TXN_OFF123",
      "payer_vpa": "alice@bank"
    }
    ```

- **Bank Reconciliation Simulation**
  - `POST /reconcile`
  - Body: `{ "provisional_txn_id": "TXN_OFF123", "official_utr": "UTR4567890" }`

- **Get All Orders**
  - `GET /orders`

- **Get All UPI Attempts**
  - `GET /upi-attempts`

## Running the Project
1. Install dependencies:  
   `npm install express body-parser cors uuid`

2. Start backend:  
   `node server.js`

3. Open frontend (`index.html`) in browser or use VS Code Live Server.

4. Test workflow:  
   Create order → Record offline payment → Reconcile with bank → See updates for customer and merchant.

## Conclusion
This project demonstrates a secure offline payment system using UPI Lite. It shows how provisional transactions are created, synced with backend, reconciled with bank, and finally updated in both customer and merchant apps.
