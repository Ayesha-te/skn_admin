import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, Upload, Film } from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";
import { toast } from "@/hooks/use-toast";

export const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, categories } = useAdminData();
  const isEditing = !!id;
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    details: "",
    delivery_charges: 0,
    featured: false,
    bestseller: false,
  });

  useEffect(() => {
    if (!formData.category && categories.length > 0) {
      setFormData(prev => ({ ...prev, category: categories[0].id.toString() }));
    }
  }, [categories]);

  useEffect(() => {
    if (isEditing) {
      const product = products.find((p) => p.id?.toString() === id);
      if (product) {
        setFormData({
          name: product.name,
          category: product.category?.toString() || (categories[0]?.id.toString() || ""),
          price: product.price,
          description: product.description,
          details: product.details || "",
          delivery_charges: product.deliveryCharges || 0,
          featured: !!product.featured,
          bestseller: !!product.bestseller,
        });
        if (product.image) setImagePreview(product.image);
        if (product.video) setVideoPreview(product.video);
        if (product.images && product.images.length > 0) {
          setAdditionalPreviews(product.images.map((img: any) => img.image || img));
        }
      }
    }
  }, [id, isEditing, products, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;
    const value = type === "checkbox" ? target.checked : target.value;
    setFormData({ ...formData, [name]: type === "number" ? parseFloat(target.value) : value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'additional') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === 'image') {
      const file = files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (type === 'video') {
      const file = files[0];
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } else if (type === 'additional') {
      const newFiles = Array.from(files);
      setAdditionalImageFiles(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setAdditionalPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });
    
    if (imageFile) {
      data.append('image', imageFile);
    }
    if (videoFile) {
      data.append('video', videoFile);
    }
    
    additionalImageFiles.forEach((file) => {
      data.append('uploaded_images', file);
    });

    try {
      if (isEditing && id) {
        await updateProduct(id, data);
        toast({ title: "Product updated successfully" });
      } else {
        await addProduct(data);
        toast({ title: "Product created successfully" });
      }
      navigate("/products");
    } catch (error) {
      toast({ title: "Error saving product", variant: "destructive" });
    }
  };

  return (
    <div className="py-12">
      <div className="luxury-container max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/products" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-serif font-light">
            {isEditing ? "Edit Product" : "New Product"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
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
              <label className="text-sm font-medium">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Charges ($)</label>
              <input
                type="number"
                name="delivery_charges"
                value={formData.delivery_charges}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
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
            <label className="text-sm font-medium">Details / Specifications</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-medium">Main Product Image</label>
              <div className="flex flex-col items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-full aspect-square border border-border overflow-hidden group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload className="text-white" size={24} />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                    </label>
                  </div>
                ) : (
                  <label className="w-full aspect-square border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/50 transition-colors">
                    <Plus size={24} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Upload Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Product Video</label>
              <div className="flex flex-col items-center gap-4">
                {videoPreview ? (
                  <div className="relative w-full aspect-square border border-border overflow-hidden group">
                    <video src={videoPreview} className="w-full h-full object-cover" controls />
                    <label className="absolute top-2 right-2 p-2 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Film className="text-white" size={16} />
                      <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} />
                    </label>
                  </div>
                ) : (
                  <label className="w-full aspect-square border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/50 transition-colors">
                    <Film size={24} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Upload Video</span>
                    <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Additional Product Images</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {additionalPreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square border border-border overflow-hidden group">
                  <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/50 transition-colors">
                <Plus size={20} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Add Image</span>
                <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleFileChange(e, 'additional')} />
              </label>
            </div>
          </div>

          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Featured Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Bestseller</span>
            </label>
          </div>

          <div className="pt-4">
            <button type="submit" className="luxury-button w-full">
              {isEditing ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
