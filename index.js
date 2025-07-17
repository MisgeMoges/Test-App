const express = require('express');
const app = express();
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();
// Replace with your actual Stripe secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');
// const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
const serviceAccount = require('./servicesAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();


app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});




// Helper to fetch tokens
async function getTokens(targetType, categories, userIds) {
  let tokens = [];
  if (targetType === 'all') {
    const snapshot = await db.collection('users').get();
    snapshot.forEach(doc => {
      if (doc.data().fcmToken) tokens.push(doc.data().fcmToken);
    });
  } else if (targetType === 'category') {
    const snapshot = await db.collection('users').where('category', 'in', categories).get();
    snapshot.forEach(doc => {
      if (doc.data().fcmToken) tokens.push(doc.data().fcmToken);
    });
  } else if (targetType === 'users') {
    const snapshot = await db.collection('users').where('userId', 'in', userIds).get();
    snapshot.forEach(doc => {
      if (doc.data().fcmToken) tokens.push(doc.data().fcmToken);
    });
  }
  return tokens;
}

app.post('/send-notification', async (req, res) => {
  const { title, body, data, targetType, categories, userIds } = req.body;
  try {
    const tokens = await getTokens(targetType, categories, userIds);
    if (!tokens.length) return res.status(404).send({ error: 'No tokens found' });
    const message = {
      notification: { title, body },
      data: data || {},
      tokens,
    };
    const response = await admin.messaging().sendMulticast(message);
    res.send({ success: true, response });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 