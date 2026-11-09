"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Search,
  Filter,
  FolderPlus,
  Trash2,
  Edit2,
  Copy,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Info,
  Maximize2,
  CheckCircle,
  Folder,
} from "lucide-react";
import { MEDIA_CATEGORIES, MediaCategory, MediaItemRecord } from "@/types/media";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItemRecord[]>([]);
  const [categories, setCategories] = useState<string[]>([...MEDIA_CATEGORIES]);
  const [selectedFolder, setSelectedFolder] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<string>("Product Images");
  const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Selected item modal / drawer
  const [selectedItem, setSelectedItem] = useState<MediaItemRecord | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingAlt, setEditingAlt] = useState("");
  const [editingFolder, setEditingFolder] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Replace image state
  const [isReplacing, setIsReplacing] = useState(false);

  // Delete state
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Create folder state
  const [newFolderInput, setNewFolderInput] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Fetch media from API
  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?folder=${encodeURIComponent(selectedFolder)}&search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setMediaList(data.data);
      }
    } catch (err) {
      console.error("Failed to load media:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedFolder, searchQuery]);

  // Handle Multiple File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadMessage(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("folder", uploadCategory);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setUploadMessage({ type: "success", text: `Successfully uploaded ${files.length} image(s)` });
        fetchMedia();
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setUploadMessage({ type: "error", text: data.error || "Upload failed" });
      }
    } catch (err: any) {
      setUploadMessage({ type: "error", text: err.message || "Network error during upload" });
    } finally {
      setIsUploading(false);
    }
  };

  // Open item inspector
  const openItemDetails = (item: MediaItemRecord) => {
    setSelectedItem(item);
    setEditingTitle(item.title);
    setEditingAlt(item.altText || "");
    setEditingFolder(item.folder);
    setDeleteWarning(null);
  };

  // Save metadata updates
  const handleSaveMetadata = async () => {
    if (!selectedItem) return;

    try {
      const res = await fetch(`/api/media/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingTitle,
          altText: editingAlt,
          folder: editingFolder,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedItem(data.data);
        fetchMedia();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Replace Image File
  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedItem) return;

    setIsReplacing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/media/${selectedItem.id}/replace`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSelectedItem(data.data);
        fetchMedia();
      }
    } catch (err) {
      console.error("Replacement failed:", err);
    } finally {
      setIsReplacing(false);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  };

  // Handle Delete with Usage Reference Check
  const handleDelete = async (force: boolean = false) => {
    if (!selectedItem) return;

    setIsDeleting(true);
    setDeleteWarning(null);

    try {
      const res = await fetch(`/api/media/${selectedItem.id}?force=${force}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.status === 409) {
        // Image is currently in use
        setDeleteWarning(data.message);
      } else if (data.success) {
        setSelectedItem(null);
        fetchMedia();
      }
    } catch (err: any) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy Image URL to clipboard
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Add new folder/category
  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderInput.trim()) return;
    if (!categories.includes(newFolderInput.trim())) {
      setCategories([...categories, newFolderInput.trim()]);
    }
    setSelectedFolder(newFolderInput.trim());
    setUploadCategory(newFolderInput.trim());
    setNewFolderInput("");
    setShowFolderInput(false);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-cream-300 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-900 tracking-tight">
            Central Media Library
          </h1>
          <p className="text-xs text-brand-charcoal-500 mt-1">
            Upload, organize, and replace images dynamically powered by Cloudinary and PostgreSQL.
          </p>
        </div>

        {/* Upload Trigger Strip */}
        <div className="flex items-center gap-3">
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-brand-cream-300 bg-white text-xs font-bold text-brand-charcoal-800"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Upload to: {c}
              </option>
            ))}
          </select>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="multi-upload-input"
          />

          <label
            htmlFor="multi-upload-input"
            className={`px-5 py-2.5 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide transition flex items-center gap-2 cursor-pointer shadow-xs ${
              isUploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <UploadCloud className="w-4 h-4 text-brand-mint-400" />
            <span>{isUploading ? "Uploading to Cloud..." : "Upload Images"}</span>
          </label>
        </div>
      </div>

      {/* Upload Notification Message */}
      {uploadMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between border ${
            uploadMessage.type === "success"
              ? "bg-brand-mint-100 border-brand-mint-300 text-brand-green-900"
              : "bg-rose-100 border-rose-300 text-rose-900"
          }`}
        >
          <span>{uploadMessage.text}</span>
          <button onClick={() => setUploadMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Folders Bar & Search */}
      <div className="space-y-4">
        
        {/* Search & New Folder Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-brand-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search images by title, tag, or ALT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-brand-cream-300 bg-white text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {showFolderInput ? (
              <form onSubmit={handleAddFolder} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Folder Name"
                  required
                  value={newFolderInput}
                  onChange={(e) => setNewFolderInput(e.target.value)}
                  className="p-1.5 px-3 rounded-lg border border-brand-cream-300 text-xs bg-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-brand-green-900 text-brand-cream-100 text-xs font-bold"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowFolderInput(false)}
                  className="text-xs text-brand-charcoal-400"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowFolderInput(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-cream-300 text-xs font-bold text-brand-charcoal-700 bg-white hover:bg-brand-cream-100 transition"
              >
                <FolderPlus className="w-3.5 h-3.5 text-brand-green-800" />
                <span>+ New Folder</span>
              </button>
            )}
          </div>
        </div>

        {/* Categories / Folders Pill Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setSelectedFolder("ALL")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold transition whitespace-nowrap border ${
              selectedFolder === "ALL"
                ? "bg-brand-green-900 text-brand-cream-100 border-brand-green-900 shadow-xs"
                : "bg-white text-brand-charcoal-700 border-brand-cream-300 hover:border-brand-mint-400"
            }`}
          >
            All Folders ({mediaList.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFolder(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold transition whitespace-nowrap border flex items-center gap-1.5 ${
                selectedFolder === cat
                  ? "bg-brand-green-900 text-brand-cream-100 border-brand-green-900 shadow-xs"
                  : "bg-white text-brand-charcoal-700 border-brand-cream-300 hover:border-brand-mint-400"
              }`}
            >
              <Folder className="w-3 h-3 text-brand-mint-500" />
              <span>{cat}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-20 text-center text-xs text-brand-charcoal-500 font-semibold">
          Loading Cloudinary media assets...
        </div>
      ) : mediaList.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white border border-brand-cream-300 text-center space-y-3">
          <UploadCloud className="w-12 h-12 text-brand-charcoal-300 mx-auto" />
          <h3 className="font-heading font-bold text-base text-brand-charcoal-800">
            No images found in &ldquo;{selectedFolder}&rdquo;
          </h3>
          <p className="text-xs text-brand-charcoal-500 max-w-sm mx-auto">
            Use the &ldquo;Upload Images&rdquo; button above to add photography directly to this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((item) => (
            <div
              key={item.id}
              onClick={() => openItemDetails(item)}
              className="group relative rounded-2xl bg-white border border-brand-cream-300 overflow-hidden shadow-2xs hover:shadow-hover hover:border-brand-mint-400 transition cursor-pointer flex flex-col"
            >
              {/* Image Thumbnail */}
              <div className="relative aspect-square w-full bg-brand-cream-100 overflow-hidden">
                <Image
                  src={item.secureUrl}
                  alt={item.altText || item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-black/60 text-white backdrop-blur-xs">
                  {item.format || "img"}
                </span>
              </div>

              {/* Caption */}
              <div className="p-2.5 space-y-0.5 flex-1 flex flex-col justify-between">
                <h4 className="text-xs font-bold text-brand-charcoal-900 truncate" title={item.title}>
                  {item.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-brand-charcoal-400">
                  <span>{item.folder}</span>
                  {item.bytes && <span>{Math.round(item.bytes / 1024)} KB</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail / Inspector Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-brand-cream-300 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-brand-cream-200 flex items-center justify-between bg-brand-cream-50">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg text-brand-green-900">
                  Image Asset Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-full hover:bg-brand-cream-200 text-brand-charcoal-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Image Preview */}
              <div className="md:col-span-6 space-y-4">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-brand-cream-300 bg-brand-cream-100 shadow-inner">
                  <Image
                    src={selectedItem.secureUrl}
                    alt={selectedItem.altText || selectedItem.title}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Replace Image Button */}
                <input
                  ref={replaceInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleReplaceFile}
                  className="hidden"
                  id="replace-file-input"
                />
                <label
                  htmlFor="replace-file-input"
                  className="w-full py-2.5 px-4 rounded-xl border border-brand-cream-300 hover:border-brand-green-800 bg-brand-cream-50 hover:bg-brand-cream-100 text-brand-green-900 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReplacing ? "animate-spin" : ""}`} />
                  <span>{isReplacing ? "Uploading Replacement..." : "Replace Image File"}</span>
                </label>

                {/* Copy URL */}
                <button
                  onClick={() => handleCopyUrl(selectedItem.secureUrl)}
                  className="w-full py-2 px-4 rounded-xl border border-brand-cream-300 text-xs font-semibold text-brand-charcoal-700 hover:bg-brand-cream-100 transition flex items-center justify-center gap-1.5"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-brand-green-700" />
                      <span className="text-brand-green-700">URL Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Public CDN URL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Metadata & Editing */}
              <div className="md:col-span-6 space-y-4 text-xs">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="font-bold text-brand-charcoal-900 block">
                    Image Title
                  </label>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                  />
                </div>

                {/* ALT Text */}
                <div className="space-y-1">
                  <label className="font-bold text-brand-charcoal-900 block">
                    Alternative (ALT) Text (SEO & Accessibility)
                  </label>
                  <input
                    type="text"
                    value={editingAlt}
                    onChange={(e) => setEditingAlt(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                  />
                </div>

                {/* Category / Folder */}
                <div className="space-y-1">
                  <label className="font-bold text-brand-charcoal-900 block">
                    Assigned Folder Category
                  </label>
                  <select
                    value={editingFolder}
                    onChange={(e) => setEditingFolder(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Technical Specifications */}
                <div className="p-3.5 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 space-y-1.5 text-[11px] text-brand-charcoal-600">
                  <div className="flex justify-between">
                    <span>Dimensions:</span>
                    <strong className="text-brand-charcoal-900">
                      {selectedItem.width || 1200} &times; {selectedItem.height || 1200} px
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>File Size:</span>
                    <strong className="text-brand-charcoal-900">
                      {selectedItem.bytes ? Math.round(selectedItem.bytes / 1024) : 240} KB
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <strong className="text-brand-charcoal-900 uppercase">
                      {selectedItem.format || "WebP"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Public ID:</span>
                    <span className="font-mono text-[10px] text-brand-charcoal-500 truncate max-w-[150px]">
                      {selectedItem.publicId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded Date:</span>
                    <strong className="text-brand-charcoal-900">
                      {new Date(selectedItem.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </strong>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveMetadata}
                  className="w-full py-2.5 rounded-xl bg-brand-green-900 text-brand-cream-100 font-bold text-xs hover:bg-brand-green-800 transition shadow-xs"
                >
                  Save Metadata Changes
                </button>

                {/* Delete Area with In-Use Warning */}
                {deleteWarning ? (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 text-rose-900">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Warning: Image In Active Use</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {deleteWarning}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleDelete(true)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition"
                      >
                        Force Delete Anyway
                      </button>
                      <button
                        onClick={() => setDeleteWarning(null)}
                        className="text-[11px] font-semibold text-brand-charcoal-600 underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDelete(false)}
                    disabled={isDeleting}
                    className="w-full py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Image Asset</span>
                  </button>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
