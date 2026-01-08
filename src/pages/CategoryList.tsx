import React from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Plus, ArrowLeft, Layers } from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";

export const CategoryList = () => {
  const { categories, deleteCategory } = useAdminData();

  return (
    <div className="py-12">
      <div className="luxury-container">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-serif font-light flex-1">Product Categories</h1>
          <Link to="/categories/new" className="luxury-button flex items-center gap-2">
            <Plus size={16} /> New Category
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="border border-border bg-card overflow-hidden flex flex-col">
              {category.image && (
                <div className="aspect-video w-full overflow-hidden border-b border-border">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {!category.image && (
                      <div className="p-2 bg-secondary rounded-lg text-primary">
                        <Layers size={20} />
                      </div>
                    )}
                    <h3 className="text-xl font-serif">{category.name}</h3>
                  </div>
                <div className="flex gap-2">
                  <Link to={`/categories/edit/${category.id}`} className="text-muted-foreground hover:text-foreground">
                    <Edit size={18} />
                  </Link>
                  <button 
                    onClick={() => {
                      if(window.confirm("Are you sure you want to delete this category?")) {
                        deleteCategory(category.id);
                      }
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {category.description || "No description provided."}
              </p>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-border bg-card">
              <p className="text-muted-foreground">No categories found. Create one to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
