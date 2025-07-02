const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String, required: true },
  country:   { type: String, required: true },
  vin:       { type: String, required: true },
  note:      { type: String },

  paymentStatus:        { type: String, default: 'Pending' },
  paypalOrderId:        { type: String },
  paypalTransactionId:  { type: String },
  payerEmail:           { type: String },

  submittedAt:          { type: Date, default: Date.now }
});


module.exports = mongoose.model('Order', orderSchema);
