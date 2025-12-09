import express from "express";
import Product from "../models/Product.js";

const router = express.Router();


// 🟩 GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products); // return raw data
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🟦 ADD PRODUCT
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.json(savedProduct); // return saved item with _id
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🟨 UPDATE PRODUCT
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🟥 DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
