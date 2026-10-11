
const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Book = require("../models/Book");
const authMiddleware = require("../middleware/authMiddleware");

// POST: Place a new order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, customerName, phone, address } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      !customerName?.trim() ||
      !phone?.trim() ||
      !address?.trim()
    ) {
      return res.status(400).json({
        message: "Please provide valid order and customer details",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.bookId || !Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({
          message: "Invalid book or quantity",
        });
      }

      const book = await Book.findById(item.bookId);

      if (!book) {
        return res.status(404).json({
          message: "Book not found",
        });
      }

      if (book.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${book.title}`,
        });
      }

      orderItems.push({
        bookId: book._id,
        title: book.title,
        quantity: item.quantity,
        price: book.price,
      });

      totalAmount += book.price * item.quantity;
    }

    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({
      message: "Failed to place order",
    });
  }
});

// GET: Logged-in user's orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});

module.exports = router;
