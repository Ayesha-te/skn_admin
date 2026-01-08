import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";
import { toast } from "@/hooks/use-toast";

export const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, addCategory, updateCategory } = useAdminData();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      const category = categories.find((c) => c.id.toString() === id?.toString());
      if (category) {
        setFormData({
          name: category.name,
          description: category.description || "",
        });
        if (category.image) {
          setImagePreview(category.image);
        }
      }
    }
  }, [id, isEditing, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      if (image) {
        data.append("image", image);
      }

      if (isEditing && id) {
        await updateCategory(id, data);
        toast({ title: "Category updated successfully" });
      } else {
        await addCategory(data);
        toast({ title: "Category created successfully" });
      }
      navigate("/categories");
    } catch (error) {
      toast({ title: "An error occurred", variant: "destructive" });
    }
  };

  return (
    <div className="py-12">
      <div className="luxury-container max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/categories" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-serif font-light">
            {isEditing ? "Edit Category" : "New Category"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Hair Toppers"
                className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the products in this category..."
                className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category Thumbnail</label>
              <div className="flex flex-col gap-4">
                {imagePreview ? (
                  <div className="relative w-full aspect-video bg-secondary overflow-hidden border border-border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-background/80 hover:bg-background text-foreground rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-border hover:border-foreground/50 transition-colors cursor-pointer bg-secondary/30">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload thumbnail</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="luxury-button w-full">
              {isEditing ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
