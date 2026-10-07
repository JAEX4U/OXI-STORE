const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
const MONGO_URI = "mongodb+srv://Spin:8nfPEE3Hp4CCyR2E@cluster0.py1moya.mongodb.net/?appName=Cluster0";
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("MongoDB connection error:", err));

// Order Schema
const OrderSchema = new mongoose.Schema({
  username: { type: String, required: true },
  utr: { type: String, default: "N/A" },
  item: { type: String, default: "VIP Rank" },
  status: { type: String, default: "PENDING" },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// API Route: Submit new order from GitHub store
app.post('/api/orders', async (req, res) => {
  try {
    const { username, utr, item } = req.body;

    const newOrder = new Order({ username, utr, item });
    await newOrder.save();

    res.status(201).json({ success: true, message: "Order logged successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API Route: Fetch all pending orders for Admin
app.get('/api/orders/pending', async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: "PENDING" }).sort({ createdAt: -1 });
    res.json(pendingOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Route: Approve an order manually
app.post('/api/orders/approve', async (req, res) => {
  try {
    const { orderId } = req.body;
    await Order.findByIdAndUpdate(orderId, { status: "APPROVED" });
    res.json({ success: true, message: "Order approved!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
