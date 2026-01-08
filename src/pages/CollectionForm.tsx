import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";
import { toast } from "@/hooks/use-toast";

export const CollectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { collections, products, addCollection, updateCollection } = useAdminData();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    products: [] as string[],
  });
  const [imagePreview, setImagePreview] = useState<string>("/placeholder.svg");

  useEffect(() => {
    if (isEditing) {
      const collection = collections.find((c) => c.id === id);
      if (collection) {
        setFormData({
          name: collection.name,
          description: collection.description,
          image: null,
          products: collection.products || [],
        });
        setImagePreview(collection.image);
      }
    }
  }, [id, isEditing, collections]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleProduct = (productId: string) => {
    const newProducts = formData.products.includes(productId)
      ? formData.products.filter((id) => id !== productId)
      : [...formData.products, productId];
    setFormData({ ...formData, products: newProducts });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    
    if (formData.image) {
      submitData.append('image', formData.image);
    }
    
    formData.products.forEach((productId) => {
      submitData.append('products', productId);
    });
    
    if (isEditing && id) {
      updateCollection(id, submitData);
      toast({ title: "Collection updated successfully" });
    } else {
      addCollection(submitData);
      toast({ title: "Collection created successfully" });
    }
    navigate("/collections");
  };

  return (
    <div className="py-12">
      <div className="luxury-container max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/collections" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-serif font-light">
            {isEditing ? "Edit Collection" : "New Collection"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Collection Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Banner Image</label>
              <div className="space-y-2">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Banner preview"
                    className="w-full aspect-video object-cover border border-border rounded"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Select Products</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-4 border border-border">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className={`relative cursor-pointer border transition-all ${
                      formData.products.includes(product.id)
                        ? "border-foreground"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <img src={product.image} alt={product.name} className="w-full aspect-square object-cover bg-secondary" />
                    <div className="p-2 bg-background/80 backdrop-blur-sm">
                      <p className="text-[10px] font-medium truncate">{product.name}</p>
                    </div>
                    {formData.products.includes(product.id) && (
                      <div className="absolute top-2 right-2 bg-foreground text-background p-1 rounded-full">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="luxury-button w-full">
              {isEditing ? "Update Collection" : "Create Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
