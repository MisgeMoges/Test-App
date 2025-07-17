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

## FCM Push Notifications

### Setup
1. Get your Firebase service account key from Firebase Console > Project Settings > Service Accounts.
2. Download the JSON file and save it as `serviceAccountKey.json` in your backend folder.
3. The backend uses `firebase-admin` to send notifications via FCM.

### Endpoint
- **POST** `/send-notification`
  - Body (for all users):
    ```json
    {
      "title": "Announcement Title",
      "body": "Announcement body text",
      "data": { "key": "value" },
      "targetType": "all"
    }
    ```
  - Body (for category):
    ```json
    {
      "title": "Announcement Title",
      "body": "Announcement body text",
      "data": { "key": "value" },
      "targetType": "category",
      "categories": ["news", "updates"]
    }
    ```
  - Body (for specific users):
    ```json
    {
      "title": "Announcement Title",
      "body": "Announcement body text",
      "data": { "key": "value" },
      "targetType": "users",
      "userIds": ["user1", "user2"]
    }
    ```
  - Returns: `{ success: true, response }` or error message.

### Firestore Structure
- Assumes a `users` collection with each user document containing:
  - `fcmToken`: The user's FCM device token
  - `category`: (optional) Category string for filtering
  - `userId`: (optional) User ID for direct targeting

### Security
- Never expose your service account key publicly.
- Restrict who can call this endpoint in production. 