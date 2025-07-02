# Stripe Backend (Node.js/Express)

This is a simple Node.js Express backend for creating Stripe payment intents, suitable for use with a Flutter app or any frontend.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Replace the Stripe secret key in `index.js`:
   ```js
   const stripe = Stripe('sk_test_xxx_REPLACE_WITH_YOUR_SECRET_KEY_xxx');
   ```
   Use your Stripe secret key (starts with `sk_test_...`).

## Running Locally

```bash
npm start
```

The server will run on [http://localhost:4242](http://localhost:4242).

## Endpoint

- **POST** `/create-payment-intent`
  - Body: `{ "amount": <integer>, "currency": "usd" }`
  - Returns: `{ "clientSecret": <string> }`

## Deployment

You can deploy this backend to any Node.js host (Render, Railway, Vercel, Glitch, etc.).

After deployment, your endpoint will be at:
```
https://your-app.onrender.com/create-payment-intent
```

## Security
- Never expose your Stripe secret key in the frontend.
- Always use HTTPS in production. 