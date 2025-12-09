import { useEffect, useState } from 'react';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { Header } from './components/Header';

// TEMP: Hardcoded backend until Vercel env is working
const API_URL =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://e-commerce-b8jn.onrender.com"
    : "http://localhost:5000";


export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

// 🔥 Safe normalize → prevents undefined crashes
const normalizeProduct = (p: any): Product => ({
  id: p?._id || p?.id || "",
  name: p?.name || "No Name",
  price: Number(p?.price) || 0,
  description: p?.description || "",
  image: p?.image || "https://via.placeholder.com/300"
});

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ⬇️ FIX: Refetch when items change (avoids UI freeze)
  const fetchProducts = () => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data.map(normalizeProduct)))
      .catch(err => console.error("Fetch error:", err));
  };

  useEffect(fetchProducts, []);

// ADD PRODUCT
const handleAddProduct = async (product: Omit<Product, "id">) => {
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });

  const result = await res.json();
  setIsFormOpen(false);

  fetchProducts(); // fetch updated list
};



  // UPDATE PRODUCT
  const handleUpdateProduct = async (product: Product) => {
    const res = await fetch(`${API_URL}/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });

    const updated = normalizeProduct(await res.json());
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  // DELETE PRODUCT (Fix: now removes correct item only)
  const handleDeleteProduct = async (id: string) => {
    if (!id) return alert("Error: No ID!");

    await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });

    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddClick={() => {
          setEditingProduct(null);
          setIsFormOpen(true);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductList
          products={products}
          onEdit={(product) => {
            setEditingProduct(product);
            setIsFormOpen(true);
          }}
          onDelete={handleDeleteProduct}
        />
      </main>

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onClose={() => {
            setEditingProduct(null);
            setIsFormOpen(false);
          }}
        />
      )}
    </div>
  );
}
