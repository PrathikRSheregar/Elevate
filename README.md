# Elevate
Problem Statement: SmartUPI Offline: Enabling Secure Digital Transactions Without Internet Connectivity 
Introduction

UPI Lite is a small-value offline payment feature introduced by NPCI, enabling users to make small-value transactions (up to ₹200 per transaction and ₹2000 total balance) without needing an internet connection. This functionality ensures seamless payments even when the user's or merchant's device is offline.
Transactions are stored locally on the device and synced with the bank later, with a unique transaction reference number (UTR) generated upon successful reconciliation.

Features

-Offline Transactions: Users can perform small payments offline.
-Preloaded Wallet: Users preload up to ₹2000 in the wallet.
-Sync with Bank Later: Transactions are reconciled once the device syncs online.
-Secure: Payments are secure, and UTR is generated post-sync with the bank.

Payment Flow
1. Wallet Top-up
-The user preloads ₹2000 to their UPI Lite wallet online (via the UPI app).
-This amount is securely stored locally on the phone, and the bank backend is aware of the balance.
2. Offline Payment
-The user wants to make a ₹150 payment offline.
-The customer opens the UPI app → selects UPI Lite → enters merchant's UPI ID.
-The customer enters their PIN, and the transaction is completed offline. The transaction details are stored locally on the device.
3. Storing the Transaction Locally
-If the merchant's device is also offline, the transaction is stored locally, including:

Order ID
Amount
Payer VPA
Transaction ID / Provisional UTR

Once the device goes online, the merchant's app syncs the transaction to the backend.
4. Backend Reconciliation
-The backend stores the transaction attempt as "pending."
-Once the device syncs with the bank, the backend verifies the provisional UTR against the bank/NPCI.
-If verified, the transaction is marked as paid.
5. Customer Confirmation
-The customer sees an immediate update in the balance (deducted amount).
-After successful syncing and verification, the official UTR is generated.
APIs
1. Create Order
Endpoint: /orders
Method: POST
-Description: Create an order for processing.

3. Offline Payment Attempt
Endpoint: /upi-attempts
Method: POST
Request Body:

{
  "order_id": "<ORDER_ID>",
  "device_id": "device-1",
  "method": "upi_lite",
  "declared_amount_cents": 15000,
  "payer_vpa": "alice@bank",
  "utr": "provisional_UTR123"
}

-Description: This endpoint records an offline payment attempt. The transaction is stored in the backend as pending until the sync happens.

3. Bank Callback
Endpoint: /provider-callback
Method: POST
Request Body:
{
  "upi_attempt_id": "<ATTEMPT_ID>",
  "provider_txn_id": "UTR4567890",
  "amount_cents": 15000
}
Description: This endpoint is called when the device syncs with the bank, verifying the payment and updating the order status as paid.

Conclusion

UPI Lite provides a convenient and secure method for handling small offline payments in scenarios with no internet access. By preloading a small balance into a UPI Lite wallet, users can continue to transact offline, with payments reconciled later when the device connects online.
