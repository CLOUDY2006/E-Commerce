import { useEffect, useState } from 'react';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { Header } from './components/Header';

// Backend URL
const API_URL = import.meta.env.VITE_API_URL;

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

// 🔥 Normalize DB object → Frontend format
const normalizeProduct = (p: any): Product => ({
  id: p._id || p.id, // <- IMPORTANT
  name: p.name,
  price: p.price,
  description: p.description,
  image: p.image
});

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // FETCH PRODUCTS FROM BACKEND
  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.map(normalizeProduct));
      })
      .catch((err) => console.log("Error fetching products:", err));
  }, []);

  // ADD PRODUCT
  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then((result) => {
        setProducts(prev => [...prev, normalizeProduct(result.product)]);
        setIsFormOpen(false);
      });
  };

  // UPDATE PRODUCT
  const handleUpdateProduct = (updatedProduct: Product) => {
    fetch(`${API_URL}/api/products/${updatedProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    })
      .then((res) => res.json())
      .then((updatedFromDB) => {
        const updated = normalizeProduct(updatedFromDB);
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        setEditingProduct(null);
        setIsFormOpen(false);
      });
  };

  // DELETE PRODUCT
  const handleDeleteProduct = (id: string) => {
    console.log("🗑️ Deleting product ID:", id);

    fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" })
      .then(() => {
        setProducts(prev => prev.filter(p => p.id !== id));
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddClick={() => setIsFormOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductList
          products={products}
          onEdit={setEditingProduct}
          onDelete={handleDeleteProduct}
        />
      </main>

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
