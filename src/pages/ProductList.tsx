import React from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Plus, ArrowLeft } from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";

export const ProductList = () => {
  const { products, deleteProduct } = useAdminData();

  return (
    <div className="py-12">
      <div className="luxury-container">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-serif font-light flex-1">Products</h1>
          <Link to="/products/new" className="luxury-button flex items-center gap-2">
            <Plus size={16} /> New Product
          </Link>
        </div>

        <div className="border border-border overflow-hidden bg-card">
          <table className="w-full text-left">
            <thead className="bg-secondary text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover bg-secondary" />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm">{product.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {product.category_name || (typeof product.category === 'object' ? (product.category as any).name : product.category)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link to={`/products/edit/${product.id}`} className="text-muted-foreground hover:text-foreground">
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => {
                          if(window.confirm("Are you sure you want to delete this product?")) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
