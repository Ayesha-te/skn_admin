import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Order, Collection, Category } from "@/data/products";

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "https://sleepy-carrie-ayesha25-2b164d3d.koyeb.app";
const API_BASE_URL = `${BASE_URL}/api`;

const formatUrl = (url: string | undefined) => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url}`;
};

interface AdminDataContextType {
  products: Product[];
  orders: Order[];
  collections: Collection[];
  categories: Category[];
  user: any | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addProduct: (product: FormData) => Promise<void>;
  updateProduct: (id: string, product: FormData | Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Promise<void>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  addCollection: (collection: FormData) => Promise<void>;
  updateCollection: (id: string, collection: FormData | Partial<Collection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addCategory: (category: FormData | Partial<Category>) => Promise<void>;
  updateCategory: (id: string, category: FormData | Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const getAuthHeader = () => {
    const auth = localStorage.getItem('admin_auth');
    return auth ? { 'Authorization': `Basic ${auth}` } : {};
  };

  const checkAuth = async () => {
    try {
      const authHeader = getAuthHeader();
      if (!Object.keys(authHeader).length) {
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/me/`, {
        headers: authHeader
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('admin_auth');
      }
    } catch (error) {
      console.error("Auth check failed", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await Promise.all([refreshProducts(), refreshOrders(), refreshCollections(), refreshCategories()]);
  };

  const refreshCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/`);
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((c: any) => ({
          ...c,
          image: formatUrl(c.image)
        }));
        setCategories(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const addCategory = async (category: FormData | Partial<Category>) => {
    try {
      const isFormData = category instanceof FormData;
      const response = await fetch(`${API_BASE_URL}/categories/`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          ...(isFormData ? {} : { 'Content-Type': 'application/json' })
        },
        body: isFormData ? category : JSON.stringify(category)
      });
      if (response.ok) {
        await refreshCategories();
      }
    } catch (error) {
      console.error("Failed to add category", error);
    }
  };

  const updateCategory = async (id: string, category: FormData | Partial<Category>) => {
    try {
      const isFormData = category instanceof FormData;
      const response = await fetch(`${API_BASE_URL}/categories/${id}/`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeader(),
          ...(isFormData ? {} : { 'Content-Type': 'application/json' })
        },
        body: isFormData ? category : JSON.stringify(category)
      });
      if (response.ok) {
        await refreshCategories();
      }
    } catch (error) {
      console.error("Failed to update category", error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (response.ok) {
        await refreshCategories();
      }
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };

  const refreshProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/`);
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((p: any) => ({
          ...p,
          price: Number(p.price),
          image: formatUrl(p.image),
          video: formatUrl(p.video),
          images: p.images ? p.images.map((img: any) => ({ ...img, image: formatUrl(img.image) })) : []
        }));
        setProducts(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const refreshOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/`, {
        headers: getAuthHeader()
      });
      if (response.ok) {
        const data = await response.json();
        // Map Django order fields to frontend interface
        const mappedOrders = data.map((o: any) => ({
          ...o,
          total: Number(o.total),
          shipping: Number(o.shipping),
          items: o.items ? o.items.map((item: any) => ({
            ...item,
            price: Number(item.price)
          })) : [],
          customer: {
            email: o.email,
            firstName: o.first_name,
            lastName: o.last_name,
            address: o.address,
            city: o.city,
            country: o.country,
            postalCode: o.postal_code,
            phone: o.phone
          }
        }));
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const refreshCollections = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/`);
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((c: any) => ({
          ...c,
          image: formatUrl(c.image)
        }));
        setCollections(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch collections", error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const auth = btoa(`${username}:${password}`);
      // First try Basic auth against /me/
      let response = await fetch(`${API_BASE_URL}/me/`, {
        headers: { 'Authorization': `Basic ${auth}` }
      });

      if (!response.ok) {
        // Fallback: try explicit login endpoint
        response = await fetch(`${API_BASE_URL}/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (!response.ok) return false;
      }

      const userData = await response.json();
      if (!userData?.is_staff) return false;
      setUser(userData);
      localStorage.setItem('admin_auth', auth);
      fetchData();
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, is_staff: true })
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        const auth = btoa(`${username}:${password}`);
        localStorage.setItem('admin_auth', auth);
        fetchData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Signup failed", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_auth');
  };

  const addProduct = async (formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData
      });
      if (response.ok) {
        await refreshProducts();
      }
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };

  const updateProduct = async (id: string, product: FormData | Partial<Product>) => {
    try {
      const isFormData = product instanceof FormData;
      const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeader(),
          ...(isFormData ? {} : { 'Content-Type': 'application/json' })
        },
        body: isFormData ? product : JSON.stringify(product)
      });
      if (response.ok) {
        await refreshProducts();
      }
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (response.ok) {
        await refreshProducts();
      }
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const addOrder = async (orderData: Omit<Order, "id" | "createdAt" | "status">) => {
    try {
      // Map frontend order to Django format
      const djangoOrder = {
        first_name: orderData.customer.firstName,
        last_name: orderData.customer.lastName,
        email: orderData.customer.email,
        address: orderData.customer.address,
        city: orderData.customer.city,
        country: orderData.customer.country,
        postal_code: orderData.customer.postalCode,
        phone: orderData.customer.phone,
        total: orderData.total,
        shipping: orderData.shipping,
        items: orderData.items.map(item => ({
          product: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image
        }))
      };

      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(djangoOrder)
      });
      if (response.ok) {
        await refreshOrders();
      }
    } catch (error) {
      console.error("Failed to add order", error);
    }
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        await refreshOrders();
      }
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  const addCollection = async (formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData
      });
      if (response.ok) {
        await refreshCollections();
      }
    } catch (error) {
      console.error("Failed to add collection", error);
    }
  };

  const updateCollection = async (id: string, collection: FormData | Partial<Collection>) => {
    try {
      const isFormData = collection instanceof FormData;
      const response = await fetch(`${API_BASE_URL}/collections/${id}/`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeader(),
          ...(isFormData ? {} : { 'Content-Type': 'application/json' })
        },
        body: isFormData ? collection : JSON.stringify(collection)
      });
      if (response.ok) {
        await refreshCollections();
      }
    } catch (error) {
      console.error("Failed to update collection", error);
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (response.ok) {
        await refreshCollections();
      }
    } catch (error) {
      console.error("Failed to delete collection", error);
    }
  };

  return (
    <AdminDataContext.Provider
      value={{
        products,
        orders,
        collections,
        categories,
        user,
        loading,
        login,
        signup,
        logout,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        addCollection,
        updateCollection,
        deleteCollection,
        addCategory,
        updateCategory,
        deleteCategory,
        refreshProducts,
        refreshOrders,
        refreshCategories,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
};
