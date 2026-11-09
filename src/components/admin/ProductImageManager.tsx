"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImageType } from "@/types";
import {
  UploadCloud,
  Trash2,
  Star,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  ImageIcon,
} from "lucide-react";

interface ProductImageManagerProps {
  initialImages: ProductImageType[];
  onChange?: (images: ProductImageType[]) => void;
}

export default function ProductImageManager({
  initialImages,
  onChange,
}: ProductImageManagerProps) {
  const [images, setImages] = useState<ProductImageType[]>(initialImages);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAltValue, setEditAltValue] = useState("");

  const updateImages = (newImgs: ProductImageType[]) => {
    setImages(newImgs);
    if (onChange) onChange(newImgs);
  };

  // Add new image by URL
  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    const newImage: ProductImageType = {
      id: `img_${Date.now()}`,
      url: newImageUrl.trim(),
      altText: newImageAlt.trim() || "Product photography",
      displayOrder: images.length + 1,
      isThumbnail: images.length === 0, // First image is default primary
    };

    const updated = [...images, newImage];
    updateImages(updated);
    setNewImageUrl("");
    setNewImageAlt("");
  };

  // Remove image
  const handleRemoveImage = (id: string) => {
    const remaining = images.filter((img) => img.id !== id);
    // If we removed the primary thumbnail, designate the first remaining as primary
    if (remaining.length > 0 && !remaining.some((img) => img.isThumbnail)) {
      remaining[0].isThumbnail = true;
    }
    updateImages(remaining);
  };

  // Set as primary thumbnail
  const handleSetPrimary = (id: string) => {
    const updated = images.map((img) => ({
      ...img,
      isThumbnail: img.id === id,
    }));
    updateImages(updated);
  };

  // Reorder images (Move Up)
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const reordered = [...images];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;
    updateImages(reordered);
  };

  // Reorder images (Move Down)
  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const reordered = [...images];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;
    updateImages(reordered);
  };

  // Save ALT text edits
  const handleSaveAlt = (id: string) => {
    const updated = images.map((img) =>
      img.id === id ? { ...img, altText: editAltValue } : img
    );
    updateImages(updated);
    setEditingId(null);
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-cream-200 pb-4">
        <div>
          <h3 className="font-heading font-black text-lg text-brand-green-900">
            Product Images & Gallery Manager
          </h3>
          <p className="text-xs text-brand-charcoal-500">
            Upload, reorder, assign primary thumbnail, and set ALT tags for this product.
          </p>
        </div>
        <span className="text-xs font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full">
          {images.length} Image(s)
        </span>
      </div>

      {/* Add New Image Form */}
      <form onSubmit={handleAddImage} className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 space-y-3">
        <span className="text-xs font-bold text-brand-charcoal-800 block">
          Add Image from Cloudinary URL:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="url"
            required
            placeholder="https://res.cloudinary.com/organichy/image/upload/..."
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="sm:col-span-7 p-2.5 rounded-xl border border-brand-cream-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
          />
          <input
            type="text"
            placeholder="ALT Description (e.g. 1kg Crunchy Jar)"
            value={newImageAlt}
            onChange={(e) => setNewImageAlt(e.target.value)}
            className="sm:col-span-3 p-2.5 rounded-xl border border-brand-cream-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
          />
          <button
            type="submit"
            className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-brand-green-900 text-brand-cream-100 font-bold text-xs hover:bg-brand-green-800 transition shadow-xs flex items-center justify-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Images List */}
      <div className="space-y-3">
        {images.map((img, idx) => (
          <div
            key={img.id}
            className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-4 ${
              img.isThumbnail
                ? "border-brand-green-800 bg-brand-mint-50/50 shadow-xs"
                : "border-brand-cream-300 bg-white"
            }`}
          >
            {/* Thumbnail Preview */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-brand-cream-100 border border-brand-cream-300 shrink-0">
                <Image src={img.url} alt={img.altText || ""} fill className="object-cover" />
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-charcoal-400">
                    #{idx + 1}
                  </span>
                  {img.isThumbnail && (
                    <span className="px-2 py-0.5 rounded-full bg-brand-green-900 text-brand-cream-100 text-[10px] font-bold uppercase tracking-wider">
                      Primary Display
                    </span>
                  )}
                </div>

                {editingId === img.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editAltValue}
                      onChange={(e) => setEditAltValue(e.target.value)}
                      className="p-1 px-2 border border-brand-cream-300 rounded text-xs bg-white"
                    />
                    <button
                      onClick={() => handleSaveAlt(img.id)}
                      className="text-xs font-bold text-brand-green-800"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-brand-charcoal-700 truncate" title={img.altText || ""}>
                    ALT: <em>{img.altText || "No ALT specified"}</em>
                  </p>
                )}
              </div>
            </div>

            {/* Actions: Reorder, Set Primary, Edit ALT, Remove */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Move Up / Down */}
              <button
                type="button"
                onClick={() => handleMoveUp(idx)}
                disabled={idx === 0}
                className="p-1.5 rounded-lg border border-brand-cream-300 hover:bg-brand-cream-100 text-brand-charcoal-600 disabled:opacity-30"
                title="Move earlier in gallery"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleMoveDown(idx)}
                disabled={idx === images.length - 1}
                className="p-1.5 rounded-lg border border-brand-cream-300 hover:bg-brand-cream-100 text-brand-charcoal-600 disabled:opacity-30"
                title="Move later in gallery"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              {/* Set Primary */}
              {!img.isThumbnail && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(img.id)}
                  className="px-3 py-1.5 rounded-lg border border-brand-cream-300 hover:border-brand-green-800 text-xs font-bold text-brand-charcoal-700 hover:text-brand-green-900 transition flex items-center gap-1"
                >
                  <Star className="w-3 h-3 text-amber-500" />
                  <span>Set Primary</span>
                </button>
              )}

              {/* Edit ALT */}
              <button
                type="button"
                onClick={() => {
                  setEditingId(img.id);
                  setEditAltValue(img.altText || "");
                }}
                className="p-1.5 rounded-lg border border-brand-cream-300 hover:bg-brand-cream-100 text-brand-charcoal-600"
                title="Edit ALT text"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleRemoveImage(img.id)}
                className="p-1.5 rounded-lg border border-brand-cream-300 hover:border-rose-300 hover:bg-rose-50 text-rose-600"
                title="Remove image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

