import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-5a8f88a2/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all products
app.get("/make-server-5a8f88a2/products", async (c) => {
  try {
    const products = await kv.getByPrefix("product:");
    return c.json({ products });
  } catch (error) {
    console.log(`Error fetching products: ${error}`);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

// Get a single product
app.get("/make-server-5a8f88a2/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const product = await kv.get(`product:${id}`);
    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }
    return c.json({ product });
  } catch (error) {
    console.log(`Error fetching product: ${error}`);
    return c.json({ error: "Failed to fetch product" }, 500);
  }
});

// Create a new product
app.post("/make-server-5a8f88a2/products", async (c) => {
  try {
    const body = await c.req.json();
    const { name, price, description, image } = body;
    
    if (!name || !price || !description || !image) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    const id = Date.now().toString();
    const product = { id, name, price, description, image };
    
    await kv.set(`product:${id}`, product);
    return c.json({ product }, 201);
  } catch (error) {
    console.log(`Error creating product: ${error}`);
    return c.json({ error: "Failed to create product" }, 500);
  }
});

// Update a product
app.put("/make-server-5a8f88a2/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { name, price, description, image } = body;
    
    const existingProduct = await kv.get(`product:${id}`);
    if (!existingProduct) {
      return c.json({ error: "Product not found" }, 404);
    }
    
    const product = { id, name, price, description, image };
    await kv.set(`product:${id}`, product);
    return c.json({ product });
  } catch (error) {
    console.log(`Error updating product: ${error}`);
    return c.json({ error: "Failed to update product" }, 500);
  }
});

// Delete a product
app.delete("/make-server-5a8f88a2/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const existingProduct = await kv.get(`product:${id}`);
    
    if (!existingProduct) {
      return c.json({ error: "Product not found" }, 404);
    }
    
    await kv.del(`product:${id}`);
    return c.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(`Error deleting product: ${error}`);
    return c.json({ error: "Failed to delete product" }, 500);
  }
});

Deno.serve(app.fetch);