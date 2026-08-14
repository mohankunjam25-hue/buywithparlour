import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  Eye,
  Tag,
  Package,
  FileText,
  UploadCloud,
  Trash2,
  Star,
  Plus,
  Link2,
  ArrowRight,
  ArrowLeft,
  Save,
  Check,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SellerNavbar } from '../../components/SellerNavbar';
import { useSellerStore } from '../../store/sellerStore';
import api from '../../services/api';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editId');

  const { profile } = useSellerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wizard Step State (1: Vital Info, 2: Price & Stock, 3: Photos, 4: Specs & Bullets, 5: Review & Submit)
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Step 1: Vital Info
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // Step 2: Price, Stock & Tax
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [hsnCode, setHsnCode] = useState('33049900');

  // Step 3: Multi-Photo Studio
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Step 4: Specs & Highlights
  const [highlights, setHighlights] = useState<string[]>([
    'Dermatologically Tested Formulation',
    'Enriched with botanical actives for visible results',
  ]);
  const [newHighlightInput, setNewHighlightInput] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [description, setDescription] = useState('');

  // Status & Alerts
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Categories & Optional Existing Product for Resubmission
  useEffect(() => {
    api
      .get('/categories')
      .then((res) => {
        const list = res.data?.data?.categories || [];
        setCategories(list);
        if (list.length > 0 && !categoryId) setCategoryId(list[0]._id);
      })
      .catch((err) => console.warn('Categories API warning:', err))
      .finally(() => setLoadingCategories(false));

    if (editId) {
      api
        .get('/seller/products')
        .then((res) => {
          const list = res.data?.data?.products || [];
          const target = list.find((p: any) => p._id === editId);
          if (target) {
            setTitle(target.title || '');
            setBrand(target.brand || '');
            setSku(target.sku || '');
            setPrice(target.price ? String(target.price) : '');
            setDiscountPrice(target.discountPrice ? String(target.discountPrice) : '');
            setStock(target.stock ? String(target.stock) : '50');
            setHsnCode(target.hsnCode || '33049900');
            setUploadedImages(target.images || []);
            setHighlights(target.highlights || ['Dermatologically Tested Formulation']);
            setIngredients(target.ingredients || '');
            setHowToUse(target.howToUse || '');
            setDescription(target.description || '');
          }
        })
        .catch((err) => console.warn('Failed to load item for edit:', err));
    }
  }, [editId]);

  // Client-Side Canvas Image Compression
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const maxDimension = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
            resolve(compressedBase64);
          } else {
            resolve(readerEvent.target?.result as string);
          }
        };
        img.src = readerEvent.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (validFiles.length === 0) {
      setErrorMsg('Please select valid image files (JPG, PNG, WEBP).');
      return;
    }

    try {
      const compressedList = await Promise.all(
        validFiles.map((file) => compressImage(file))
      );
      setUploadedImages((prev) => [...prev, ...compressedList]);
      setErrorMsg('');
    } catch {
      setErrorMsg('Failed to process image files.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleAddUrlImage = () => {
    if (customUrlInput.trim()) {
      setUploadedImages((prev) => [...prev, customUrlInput.trim()]);
      setCustomUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetMainCover = (index: number) => {
    if (index === 0) return;
    setUploadedImages((prev) => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  const handleAddHighlight = () => {
    if (newHighlightInput.trim()) {
      setHighlights((prev) => [...prev, newHighlightInput.trim()]);
      setNewHighlightInput('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateSavings = () => {
    const p = parseFloat(price);
    const dp = parseFloat(discountPrice);
    if (p && dp && p > dp) {
      const discountPercent = Math.round(((p - dp) / p) * 100);
      return `${discountPercent}% off (Save ₹${p - dp})`;
    }
    return null;
  };

  // Step Validator
  const validateStep = (step: number): boolean => {
    setErrorMsg('');
    if (step === 1) {
      if (!title.trim() || !brand.trim()) {
        setErrorMsg('Please provide both Product Title and Brand Name.');
        return false;
      }
    }
    if (step === 2) {
      if (!price || Number(price) <= 0) {
        setErrorMsg('Please provide a valid MRP price.');
        return false;
      }
      if (discountPrice && Number(discountPrice) >= Number(price)) {
        setErrorMsg('Selling offer price must be lower than MRP.');
        return false;
      }
    }
    if (step === 3) {
      if (uploadedImages.length === 0) {
        setErrorMsg('Please upload at least 1 product photograph.');
        return false;
      }
    }
    if (step === 4) {
      if (!description.trim()) {
        setErrorMsg('Please write a product description.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit for QC or Save Draft
  const handleFinalSubmit = async (isDraft: boolean) => {
    if (!isDraft) {
      for (let s = 1; s <= 4; s++) {
        if (!validateStep(s)) {
          setCurrentStep(s);
          return;
        }
      }
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const defaultFallbackImage =
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80';
      const imagesToSubmit =
        uploadedImages.length > 0 ? uploadedImages : [defaultFallbackImage];

      const payload = {
        title: title || 'Draft Product',
        brand: brand || 'Generic',
        sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
        price: Number(price) || 0,
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        stock: Number(stock) || 10,
        category: categoryId || undefined,
        hsnCode,
        description: description || 'Draft description',
        highlights,
        ingredients,
        howToUse,
        images: imagesToSubmit,
        isDraft,
        resubmitForQc: !isDraft,
      };

      if (editId) {
        await api.put(`/seller/products/${editId}`, payload);
      } else {
        await api.post('/seller/products', payload);
      }

      setToastMessage(
        isDraft
          ? '💾 Listing saved as Draft successfully!'
          : '🎉 Product submitted for Quality Check (QC)! Dispatched to Admin Quality Desk.'
      );

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit product to server');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Vital Info', icon: FileText },
    { num: 2, label: 'Price & Stock', icon: Tag },
    { num: 3, label: 'Photos (Cloudinary)', icon: UploadCloud },
    { num: 4, label: 'Specs & Bullets', icon: Layers },
    { num: 5, label: 'Review & Submit', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-[#F1F3F6] text-[#212121] flex flex-col font-sans pb-16 md:pb-8">
      <SellerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Flipkart Seller Hub Header */}
        <div className="border-b border-[#E0E0E0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#212121] flex items-center gap-1.5">
              <Package className="w-5 h-5 text-[#2874F0]" />
              <span>Flipkart Seller Hub — 5-Step Product Listing Pipeline</span>
            </h1>
            <p className="text-xs text-[#878787] mt-0.5">
              Follow the official Flipkart QC guidelines to ensure 100% first-time approval
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleFinalSubmit(true)}
              disabled={submitting}
              className="bg-white border border-[#E0E0E0] hover:bg-slate-50 text-[#212121] text-xs font-semibold px-3 py-1.5 rounded-[2px] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-[#878787]" />
              <span>Save Draft</span>
            </button>
          </div>
        </div>

        {/* 5-Step Progress Stepper */}
        <div className="bg-white border border-[#EEEEEE] p-3 sm:p-4 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] overflow-x-auto">
          <div className="flex items-center justify-between min-w-[550px] gap-2">
            {stepsList.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <React.Fragment key={step.num}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.num)}
                    className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
                  >
                    <div
                      className={`w-7 h-7 rounded-[2px] flex items-center justify-center font-bold text-xs transition-colors ${
                        isCompleted
                          ? 'bg-[#2E7D32] text-white'
                          : isCurrent
                          ? 'bg-[#2874F0] text-white ring-2 ring-[#2874F0]/30'
                          : 'bg-slate-100 text-[#878787]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="text-[10px] text-[#878787] font-semibold block leading-none">
                        STEP {step.num}
                      </span>
                      <span
                        className={`text-xs font-bold whitespace-nowrap block mt-0.5 ${
                          isCurrent ? 'text-[#2874F0]' : 'text-[#212121]'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  </button>

                  {idx < stepsList.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] mx-2 rounded-full transition-colors ${
                        currentStep > idx + 1 ? 'bg-[#2E7D32]' : 'bg-[#E0E0E0]'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Alerts */}
        {toastMessage && (
          <div className="bg-[#E8F5E9] border border-[#2E7D32]/20 text-[#2E7D32] p-3 rounded-[2px] text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-[#FFEBEE] border border-[#D32F2F]/20 text-[#D32F2F] p-3 rounded-[2px] text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
            <AlertCircle className="w-4 h-4 text-[#D32F2F] flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main 2-Column Responsive Form & Replica Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Form Content */}
          <div className="lg:col-span-7 bg-white border border-[#EEEEEE] p-5 sm:p-6 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-5">
            {/* STEP 1: CATEGORY & VITAL INFO */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="border-b border-[#EEEEEE] pb-2.5">
                  <h2 className="text-sm font-bold text-[#212121]">Step 1: Category & Vital Product Information</h2>
                  <p className="text-xs text-[#878787]">
                    Accurate titles and categories ensure high search visibility on the customer marketplace
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-[#212121] block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Kumkumadi Ayurvedic Night Glow Facial Oil (30ml)"
                    className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] placeholder:text-[#878787] focus:outline-none focus:border-[#2874F0]"
                  />
                  <span className="text-[10px] text-[#878787] mt-0.5 block">
                    Flipkart Standard: Include Brand + Product Type + Key Feature + Size (e.g. 30ml)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. KamaAyur / GlowSkin Pro"
                      className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] placeholder:text-[#878787] focus:outline-none focus:border-[#2874F0]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">Category *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0] cursor-pointer"
                    >
                      {loadingCategories ? (
                        <option>Loading categories...</option>
                      ) : (
                        categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#212121] block mb-1">Seller SKU / Inventory Identifier</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. SKU-KUMKUMADI-30ML"
                    className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] font-mono uppercase focus:outline-none focus:border-[#2874F0]"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: PRICE, STOCK & TAX */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="border-b border-[#EEEEEE] pb-2.5">
                  <h2 className="text-sm font-bold text-[#212121]">Step 2: Pricing, Inventory & Tax Compliance</h2>
                  <p className="text-xs text-[#878787]">
                    Set maximum retail price (MRP), customer discount offer, and available inventory units
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">MRP Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="999"
                      className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] font-bold focus:outline-none focus:border-[#2874F0]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">Your Selling Offer Price (₹)</label>
                    <input
                      type="number"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      placeholder="699"
                      className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] font-bold focus:outline-none focus:border-[#2874F0]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">Available Stock Units *</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="50"
                      className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] font-bold focus:outline-none focus:border-[#2874F0]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">HSN / Tax Code</label>
                    <input
                      type="text"
                      value={hsnCode}
                      onChange={(e) => setHsnCode(e.target.value)}
                      placeholder="33049900"
                      className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] font-mono focus:outline-none focus:border-[#2874F0]"
                    />
                  </div>
                </div>

                {calculateSavings() && (
                  <div className="p-3 bg-[#E8F5E9] border border-[#2E7D32]/20 rounded-[2px] text-xs text-[#2E7D32] font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                    <span>Customer Discount Badge: <strong>{calculateSavings()}</strong></span>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: MULTI-PHOTO STUDIO (CLOUDINARY) */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-2.5">
                  <div>
                    <h2 className="text-sm font-bold text-[#212121]">Step 3: Multi-Photo Studio (Cloudinary CDN)</h2>
                    <p className="text-xs text-[#878787]">
                      Upload multiple angles. First image will be your primary cover photo.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[#2874F0] hover:underline flex items-center gap-1 text-[11px] font-semibold"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>{showUrlInput ? 'Hide URL' : 'Paste URL'}</span>
                  </button>
                </div>

                {showUrlInput && (
                  <div className="flex gap-2 p-2 bg-slate-50 border border-[#E0E0E0] rounded-[2px]">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 bg-white border border-[#E0E0E0] rounded-[2px] px-2.5 py-1 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrlImage}
                      className="bg-[#2874F0] hover:bg-[#1259c7] text-white font-semibold text-xs px-3 py-1 rounded-[2px]"
                    >
                      Add URL
                    </button>
                  </div>
                )}

                {/* Drag & Drop Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-[4px] p-6 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-[#2874F0] bg-blue-50/50'
                      : 'border-[#E0E0E0] hover:border-[#2874F0] bg-slate-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <UploadCloud className="w-8 h-8 text-[#2874F0] mx-auto mb-1.5" />
                  <p className="font-semibold text-xs text-[#212121]">
                    Click to select multiple photos or drag & drop files here
                  </p>
                  <p className="text-[10px] text-[#878787] mt-0.5">
                    High-resolution JPG, PNG, WEBP • Automatically optimized and uploaded to Cloudinary
                  </p>
                </div>

                {/* Photo Gallery Grid */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                    {uploadedImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square border border-[#E0E0E0] rounded-[2px] overflow-hidden bg-white group"
                      >
                        <img
                          src={imgUrl}
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-full object-contain p-1"
                        />

                        {idx === 0 ? (
                          <span className="absolute top-1 left-1 bg-[#2874F0] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[2px]">
                            COVER
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetMainCover(idx)}
                            title="Set as Main Cover Photo"
                            className="absolute top-1 left-1 bg-white/90 hover:bg-white text-[#2874F0] text-[9px] font-bold px-1 py-0.5 rounded-[2px] shadow-sm flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Star className="w-2.5 h-2.5 fill-[#2874F0]" />
                            <span>Cover</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          title="Delete photo"
                          className="absolute top-1 right-1 bg-white/90 hover:bg-[#FFEBEE] text-[#D32F2F] p-1 rounded-[2px] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border border-dashed border-[#2874F0] rounded-[2px] flex flex-col items-center justify-center text-[#2874F0] hover:bg-blue-50/50 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-[10px] font-semibold mt-0.5">Add Angle</span>
                    </button>
                  </div>
                )}

                {/* Quality Checklist */}
                <div className="p-3 bg-slate-50 border border-[#E0E0E0] rounded-[2px] text-xs text-[#666666] space-y-1">
                  <span className="font-semibold text-[#212121] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#2874F0]" /> Flipkart Photography QC Guidelines:
                  </span>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 text-[#878787]">
                    <li>Clean, clear product focus without blurry watermarks</li>
                    <li>Square 1:1 aspect ratio recommended</li>
                    <li>Upload at least 2-3 angles (front, back, texture/dropper)</li>
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 4: SPECS & HIGHLIGHTS */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="border-b border-[#EEEEEE] pb-2.5">
                  <h2 className="text-sm font-bold text-[#212121]">Step 4: Product Specifications & Key Highlights</h2>
                  <p className="text-xs text-[#878787]">
                    Bullet points and ingredients build shopper trust and boost conversions
                  </p>
                </div>

                {/* Key Highlights Bullet Builder */}
                <div className="space-y-2">
                  <label className="font-semibold text-[#212121] block">Key Highlights / Feature Bullets</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHighlightInput}
                      onChange={(e) => setNewHighlightInput(e.target.value)}
                      placeholder="e.g. Formulated with 10% pure saffron oil"
                      className="flex-1 bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddHighlight();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="bg-[#2874F0] hover:bg-[#1259c7] text-white font-semibold text-xs px-4 py-2 rounded-[2px]"
                    >
                      Add Bullet
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {highlights.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-slate-50 border border-[#E0E0E0] rounded-[2px] text-xs"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2874F0]" />
                          <span>{bullet}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(idx)}
                          className="text-[#D32F2F] hover:text-rose-700 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#212121] block mb-1">Formulation & Ingredients Disclosure</label>
                  <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="e.g. Saffron Oil, Red Sandalwood, Manjistha, Pure Sesame Oil"
                    className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] placeholder:text-[#878787] focus:outline-none focus:border-[#2874F0]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#212121] block mb-1">How To Use / Application Guide</label>
                  <input
                    type="text"
                    value={howToUse}
                    onChange={(e) => setHowToUse(e.target.value)}
                    placeholder="e.g. Take 3-4 drops and massage in upward circular strokes at night."
                    className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] placeholder:text-[#878787] focus:outline-none focus:border-[#2874F0]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#212121] block mb-1">Detailed Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide detailed benefits, skin suitability, salon results, and storage instructions..."
                    className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] placeholder:text-[#878787] focus:outline-none focus:border-[#2874F0]"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & SUBMIT FOR QC */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="border-b border-[#EEEEEE] pb-2.5">
                  <h2 className="text-sm font-bold text-[#212121]">Step 5: Final Review & Submit for Quality Check (QC)</h2>
                  <p className="text-xs text-[#878787]">
                    Review your complete listing parameters before submitting to the Quality Gate
                  </p>
                </div>

                {/* Review Specs Summary Table */}
                <div className="border border-[#E0E0E0] rounded-[2px] overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <tbody className="divide-y divide-[#EEEEEE]">
                      <tr className="bg-slate-50">
                        <td className="p-2.5 font-semibold text-[#878787] w-1/3">Product Title</td>
                        <td className="p-2.5 font-bold text-[#212121]">{title || '—'}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-[#878787]">Brand & Category</td>
                        <td className="p-2.5 text-[#212121]">{brand} • {categories.find((c) => c._id === categoryId)?.name || 'General'}</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="p-2.5 font-semibold text-[#878787]">Pricing</td>
                        <td className="p-2.5 text-[#212121]">
                          <strong>MRP: ₹{price}</strong> {discountPrice && `• Selling Price: ₹${discountPrice}`} {calculateSavings() && `(${calculateSavings()})`}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-[#878787]">Inventory & Tax</td>
                        <td className="p-2.5 text-[#212121]">Stock: {stock} units • HSN: {hsnCode} • SKU: {sku || 'Auto-generated'}</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="p-2.5 font-semibold text-[#878787]">Uploaded Photos</td>
                        <td className="p-2.5 text-[#212121] font-semibold text-[#2874F0]">{uploadedImages.length} High-Res Photos Ready</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-[#FFF3E0] border border-[#ED6C02]/20 rounded-[2px] text-xs text-[#ED6C02] space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <Info className="w-4 h-4" /> Flipkart QC Policy Notice:
                  </span>
                  <p>
                    Once submitted, your listing will enter the <strong>Moderation Queue</strong>. Our Quality Desk verifies all beauty formulations and pricing before making it live on the marketplace.
                  </p>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#EEEEEE]">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-slate-100 hover:bg-slate-200 text-[#212121] text-xs font-semibold px-4 py-2 rounded-[2px] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>PREVIOUS STEP</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-[#2874F0] hover:bg-[#1259c7] text-white font-semibold text-xs px-6 py-2 rounded-[2px] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>NEXT: {stepsList[currentStep]?.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleFinalSubmit(false)}
                  disabled={submitting}
                  className="bg-[#2E7D32] hover:bg-[#256628] text-white font-bold text-xs px-8 py-2.5 rounded-[2px] shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'SUBMITTING TO QC...' : 'SUBMIT FOR QUALITY CHECK (QC)'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Marketplace Card Replica Preview */}
          <div className="lg:col-span-5 space-y-3 sticky top-20">
            <div className="flex items-center justify-between text-xs text-[#878787]">
              <span className="font-semibold text-[#212121] flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#2874F0]" />
                <span>Live Marketplace Card Replica</span>
              </span>
              <span className="text-[10px] bg-slate-100 text-[#2874F0] font-bold px-2 py-0.5 rounded-[2px]">
                Port 5173 Card Replica
              </span>
            </div>

            {/* Product Card Replica */}
            <div className="bg-white rounded-[4px] border border-[#EEEEEE] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.08)] p-3 space-y-2">
              <div className="w-full aspect-square bg-white flex items-center justify-center overflow-hidden border border-[#EEEEEE] rounded-[2px] relative">
                <img
                  src={
                    uploadedImages[0] ||
                    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
                  }
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Photo Thumbnails in Preview */}
              {uploadedImages.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {uploadedImages.map((img, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-[2px] border border-[#E0E0E0] overflow-hidden flex-shrink-0"
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#878787] uppercase tracking-wider">
                  {brand || 'BRAND NAME'}
                </span>
                <h3 className="text-xs font-bold text-[#212121] line-clamp-1">
                  {title || 'Product Title Will Appear Here'}
                </h3>

                <div className="flex items-baseline gap-1.5 pt-0.5">
                  <span className="text-sm font-bold text-[#212121]">
                    ₹{discountPrice || price || '0'}
                  </span>
                  {discountPrice && price && (
                    <span className="text-xs text-[#878787] line-through">₹{price}</span>
                  )}
                  {calculateSavings() && (
                    <span className="text-xs font-semibold text-[#2E7D32]">{calculateSavings()}</span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-[#EEEEEE] flex items-center justify-between text-[10px] text-[#878787]">
                <span>Sold by <strong className="text-[#212121]">{profile.businessName}</strong></span>
                <span className="text-[#2E7D32] font-semibold">Stock: {stock}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
