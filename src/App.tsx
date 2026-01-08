import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { AdminDataProvider, useAdminData } from "@/contexts/AdminDataContext";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ProductList } from "./pages/ProductList";
import { ProductForm } from "./pages/ProductForm";
import { CollectionList } from "./pages/CollectionList";
import { CollectionForm } from "./pages/CollectionForm";
import { CategoryList } from "./pages/CategoryList";
import { CategoryForm } from "./pages/CategoryForm";
import { OrderList } from "./pages/OrderList";
import { Login } from "./pages/Login";
import { Package, ShoppingCart, Layers, LayoutDashboard, LogOut, Grid } from "lucide-react";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAdminData();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  const { user, logout } = useAdminData();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="luxury-container h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-serif tracking-tight">
            SKN <span className="font-sans text-xs uppercase tracking-[0.2em] ml-1">Admin</span>
          </Link>
          
          {user && (
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/products" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                <Package size={16} /> Products
              </Link>
              <Link to="/categories" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                <Grid size={16} /> Categories
              </Link>
              <Link to="/collections" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                <Layers size={16} /> Collections
              </Link>
              <Link to="/orders" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                <ShoppingCart size={16} /> Orders
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold uppercase">
                  {user.username?.[0] || 'A'}
                </div>
                <button onClick={logout} className="text-muted-foreground hover:text-foreground">
                  <LogOut size={18} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
          <Route path="/products/new" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
          <Route path="/products/edit/:id" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute><CategoryList /></PrivateRoute>} />
          <Route path="/categories/new" element={<PrivateRoute><CategoryForm /></PrivateRoute>} />
          <Route path="/categories/edit/:id" element={<PrivateRoute><CategoryForm /></PrivateRoute>} />
          <Route path="/collections" element={<PrivateRoute><CollectionList /></PrivateRoute>} />
          <Route path="/collections/new" element={<PrivateRoute><CollectionForm /></PrivateRoute>} />
          <Route path="/collections/edit/:id" element={<PrivateRoute><CollectionForm /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrderList /></PrivateRoute>} />
        </Routes>
      </main>

      <footer className="border-t border-border py-8 bg-card mt-auto">
        <div className="luxury-container">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SKN Hair Care Admin. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AdminDataProvider>
        <AppContent />
      </AdminDataProvider>
    </BrowserRouter>
  );
}

export default App;
