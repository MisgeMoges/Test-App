const express = require('express');
const app = express();
const Stripe = require('stripe');
const cors = require('cors');

// Replace with your actual Stripe secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 