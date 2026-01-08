import React from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Plus, ArrowLeft } from "lucide-react";
import { useAdminData } from "@/contexts/AdminDataContext";

export const CollectionList = () => {
  const { collections, deleteCollection } = useAdminData();

  return (
    <div className="py-12">
      <div className="luxury-container">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-serif font-light flex-1">Collections</h1>
          <Link to="/collections/new" className="luxury-button flex items-center gap-2">
            <Plus size={16} /> New Collection
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div key={collection.id} className="border border-border bg-card overflow-hidden flex flex-col">
              <div className="aspect-[16/9] relative">
                <img src={collection.image} alt={collection.name} className="w-full h-full object-cover bg-secondary" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif">{collection.name}</h3>
                  <div className="flex gap-2">
                    <Link to={`/collections/edit/${collection.id}`} className="text-muted-foreground hover:text-foreground">
                      <Edit size={18} />
                    </Link>
                    <button 
                      onClick={() => {
                        if(window.confirm("Are you sure you want to delete this collection?")) {
                          deleteCollection(collection.id);
                        }
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{collection.description}</p>
                <p className="text-xs font-medium mt-auto">
                  {collection.products.length} Products
                </p>
              </div>
            </div>
          ))}
          {collections.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-border bg-card">
              <p className="text-muted-foreground">No collections found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
