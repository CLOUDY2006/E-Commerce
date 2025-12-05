import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// 🟩 GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    // Convert _id → id
    const formatted = products.map(product => ({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🟦 ADD product
const handleAddProduct = (product: Omit<Product, 'id'>) => {
  fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  })
    .then(res => res.json())
    .then(result => {
      const mappedProduct = {
        id: result.product._id,
        name: result.product.name,
        price: result.product.price,
        description: result.product.description,
        image: result.product.image
      };

      setProducts(prev => [...prev, mappedProduct]);
      setIsFormOpen(false);
    });
};



// UPDATE PRODUCT
const handleUpdateProduct = (updatedProduct: Product) => {
  fetch(`${API_URL}/api/products/${updatedProduct.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedProduct)
  })
    .then(res => res.json())
    .then(result => {
      const mappedProduct = {
        id: result._id,
        name: result.name,
        price: result.price,
        description: result.description,
        image: result.image
      };

      setProducts(prev => prev.map(p => p.id === mappedProduct.id ? mappedProduct : p));
      setEditingProduct(null);
      setIsFormOpen(false);
    });
};


// 🟥 DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id || id === "undefined") {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while deleting product" });
  }
});


export default router;
