const express = require('express');
const router = express.Router();
const path = require('path');
const Order = require('../models/Order');

// PayPal setup
const paypal = require('@paypal/checkout-server-sdk');

console.log("PayPal ID:", process.env.PAYPAL_CLIENT_ID);
console.log("PayPal Secret:", process.env.PAYPAL_CLIENT_SECRET ? "✅ Loaded" : "❌ Not Loaded");

const client = new paypal.core.PayPalHttpClient(
  new paypal.core.LiveEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

// Homepage route
router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '..', 'public', 'index.html');
  res.sendFile(filePath);
});

// Serve form.html
router.get('/form', (req, res) => {
  const filePath = path.join(__dirname, '..', 'public', 'form.html');
  res.sendFile(filePath);
});

// Create PayPal order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: Number(amount).toFixed(2)
      }
    }]
  });

  try {
    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error('PayPal Error:', err);
    res.status(500).send('PayPal order creation failed');
  }
});

// Submit form after payment
router.post('/submit-form', async (req, res) => {
  const data = req.body;

  try {
    await Order.create({
      ...data,
      submittedAt: new Date()
    });
    res.json({ message: 'Form saved successfully' });
  } catch (err) {
    console.error('Mongo Insert Error:', err);
    res.status(500).json({ message: 'Failed to save form' });
  }
});

// Admin panel login + dashboard
router.get('/admin', async (req, res) => {
  if (req.session.loggedIn) {
    try {
      const orders = await Order.find().sort({ submittedAt: -1 }).lean();
      res.render('admin', { orders }); // ✅ this renders admin.ejs
    } catch (err) {
      console.error(err);
      res.status(500).send('Database error.');
    }
  } else {
    // Login form
    res.send(`
      <h2>Admin Login</h2>
      <form method="POST" action="/admin">
        <input type="password" name="password" placeholder="Enter password" required />
        <button type="submit">Login</button>
      </form>
    `);
  }
});


// Admin login POST
router.post('/admin', (req, res) => {
  const { password } = req.body;
  if (password === 'bazilshahzad9112001') {
    req.session.loggedIn = true;
    res.redirect('/admin');
  } else {
    res.send('Incorrect password. <a href="/admin">Try again</a>');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin');
  });
});

module.exports = router;
