import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Truck, PackageCheck, XCircle, Clock } from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";
import { Order } from "@/data/products";

export const OrderList = () => {
  const { orders, updateOrderStatus } = useAdminData();

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending": return <Clock size={16} />;
      case "paid": return <CheckCircle2 size={16} />;
      case "shipped": return <Truck size={16} />;
      case "delivered": return <PackageCheck size={16} />;
      case "cancelled": return <XCircle size={16} />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "paid": return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped": return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
    }
  };

  return (
    <div className="py-12">
      <div className="luxury-container">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-serif font-light flex-1">Orders</h1>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-border bg-card p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-medium">{order.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
                    className="text-xs border border-border bg-transparent px-2 py-1 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold mb-4 text-muted-foreground">Customer Info</h4>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                    <p>{order.customer.email}</p>
                    <p>{order.customer.phone}</p>
                    <p className="mt-2">{order.customer.address}</p>
                    <p>{order.customer.city}, {order.customer.postalCode}</p>
                    <p>{order.customer.country}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold mb-4 text-muted-foreground">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover bg-secondary" />
                        <div className="flex-1 text-sm">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity} × ${item.price}</p>
                        </div>
                        <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{parseFloat(order.shipping as any) === 0 ? "Free" : `$${parseFloat(order.shipping as any).toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${parseFloat(order.total as any).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="py-20 text-center border border-dashed border-border bg-card">
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
