import React from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Layers, Plus } from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";

export const AdminDashboard = () => {
  const { products, orders, collections } = useAdminData();

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, href: "/products" },
    { label: "Total Orders", value: orders.length, icon: ShoppingCart, href: "/orders" },
    { label: "Total Collections", value: collections.length, icon: Layers, href: "/collections" },
  ];

  return (
    <div className="py-12">
      <div className="luxury-container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-light">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Link to="/products/new" className="luxury-button flex items-center gap-2">
              <Plus size={16} /> New Product
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.href}
              className="p-6 border border-border bg-card hover:border-foreground transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary rounded-full">
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <div className="border border-border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif">Recent Orders</h2>
              <Link to="/orders" className="text-sm underline">View All</Link>
            </div>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center border-b border-border pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      order.status === 'paid' ? 'bg-green-100 text-green-700' : 
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-muted-foreground text-center py-4">No orders yet</p>}
            </div>
          </div>

          <div className="border border-border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif">Recent Products</h2>
              <Link to="/products" className="text-sm underline">View All</Link>
            </div>
            <div className="space-y-4">
              {products.slice(-5).reverse().map((product) => (
                <div key={product.id} className="flex items-center gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover bg-secondary" />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <p className="font-medium">${product.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
