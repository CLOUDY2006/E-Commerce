import { useEffect, useState } from 'react';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { Header } from './components/Header';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ✅ FETCH PRODUCTS FROM BACKEND
useEffect(() => {
  fetch("http://localhost:5000/api/products")
    .then((res) => res.json())
    .then((data) => {
      const formatted = data.map((product: any) => ({
        id: product._id,                 // <-- MAPPING GOES HERE
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image
      }));
      setProducts(formatted);
    })
    .catch((err) => console.log("Error fetching products:", err));
}, []);

  // ✅ ADD PRODUCT (POST to backend)
  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    })
      .then((res) => res.json())
      .then((newProduct) => {
        setProducts([...products, newProduct]); // Add to UI
        setIsFormOpen(false);
      });
  };

  // ✅ UPDATE PRODUCT (PUT to backend)
  const handleUpdateProduct = (updatedProduct: Product) => {
    fetch(`http://localhost:5000/api/products/${updatedProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct)
    })
      .then((res) => res.json())
      .then((productFromDB) => {
        setProducts(products.map(p => p.id === productFromDB.id ? productFromDB : p));
        setEditingProduct(null);
        setIsFormOpen(false);
      });
  };

  // ✅ DELETE PRODUCT (DELETE to backend)
  const handleDeleteProduct = (id: string) => {
    fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE"
    }).then(() => {
      setProducts(products.filter((p) => p.id !== id));
    });
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddClick={() => setIsFormOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductList
          products={products}
          onEdit={handleEditClick}
          onDelete={handleDeleteProduct}
        />
      </main>

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
