import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2, ChevronLeft,
  Sparkles, RefreshCw, Bot,
} from "lucide-react";
import { verifyListing, buildRawText, checkAgentHealth } from "@features/ai-service/listingVerifier";
import { VerificationPanel, type ExtractedData } from "@features/landlord/components/VerificationPanel";
import { ImageUploadStep, type ImageItem } from "@features/landlord/components/ImageUploadStep";

type ValidationError = { field: string; type: string; message: string; suggestion?: string };

export default function ListingTab() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: "", address: "", price: "", area: "", rooms: "2", description: "" });
  const [images, setImages] = useState<ImageItem[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [agentOnline, setAgentOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkAgentHealth().then(setAgentOnline);
  }, []);

  const runSimulation = useCallback((fd: typeof formData) => {
    const mockErrors: ValidationError[] = [];
    if (fd.title.length < 15) mockErrors.push({ field: "title", type: "warning", message: "Tiêu đề quá ngắn — AI gợi ý thêm chi tiết", suggestion: `${fd.title || "Căn hộ"} 2PN full nội thất, view đẹp, Quận 7` });
    if (fd.price && parseInt(fd.price) < 5000) mockErrors.push({ field: "price", type: "error", message: "Giá có vẻ quá thấp so với thị trường khu vực này" });
    if (fd.description.length < 50) mockErrors.push({ field: "description", type: "warning", message: "Mô tả quá ngắn — cần ít nhất 50 từ để tối ưu tìm kiếm", suggestion: "Căn hộ 2 phòng ngủ, 2 vệ sinh, đầy đủ nội thất cao cấp. Tầng cao view thoáng. Có hồ bơi, gym, bảo vệ 24/7..." });
    const genTitle = fd.title.length >= 15 ? fd.title : `Cho thuê ${fd.rooms || "2"}PN ${fd.area ? fd.area + "m² " : ""}– ${fd.address?.split(",").slice(-2).join(",").trim() || "TP.HCM"} – Full nội thất cao cấp`;
    const genDesc = fd.description.length >= 80 ? fd.description : `Căn hộ ${fd.rooms || "2"} phòng ngủ, diện tích ${fd.area || "65"}m², đầy đủ nội thất cao cấp. Tọa lạc tại ${fd.address || "trung tâm TP.HCM"}, thuận tiện di chuyển, gần tiện ích. Hợp đồng linh hoạt 12–24 tháng.`;
    let score = 45;
    if (fd.title.length >= 15) score += 15;
    if (fd.description.length >= 80) score += 20;
    if (fd.price) score += 8;
    if (fd.area) score += 7;
    if (mockErrors.length === 0) score += 5;
    setExtractedData({
      entities: [
        { label: "Loại BĐS", value: "Căn hộ chung cư", confidence: 98 },
        { label: "Số phòng ngủ", value: `${fd.rooms || "2"} PN`, confidence: 96 },
        { label: "Diện tích", value: fd.area ? `${fd.area}m²` : "Chưa phát hiện", confidence: fd.area ? 93 : 28 },
        { label: "Giá thuê", value: fd.price ? `${Number(fd.price).toLocaleString()} ₫/th` : "Chưa rõ", confidence: fd.price ? 95 : 22 },
        { label: "Trạng thái NT", value: fd.description.includes("nội thất") ? "Full nội thất" : "Chưa xác định", confidence: fd.description.includes("nội thất") ? 84 : 40 },
        { label: "Chính sách thú cưng", value: "Không đề cập", confidence: 45 },
      ],
      seoTitle: genTitle, seoDescription: genDesc, seoScore: Math.min(score, 95), isReal: false,
    });
    setValidationErrors(mockErrors);
  }, []);

  const triggerAIVerification = async () => {
    setIsVerifying(true);
    setVerificationDone(false);
    setExtractedData(null);

    const rawText = buildRawText(formData);
    const result = await verifyListing({ rawText, owner_id: `landlord-${Date.now()}` });

    if (result && result.success && result.data) {
      const { listing, apartment_meta, image_tags_suggested, validation } = result.data;
      const apiErrors: ValidationError[] = [];
      if (validation.missing_fields.includes("price"))
        apiErrors.push({ field: "price", type: "error", message: "Gemini: Chưa phát hiện giá thuê trong mô tả" });
      if (validation.missing_fields.includes("area"))
        apiErrors.push({ field: "area", type: "warning", message: "Gemini: Chưa phát hiện diện tích" });
      if (validation.issues.length > 0)
        apiErrors.push({ field: "description", type: "warning", message: validation.issues[0], suggestion: validation.feedback_to_owner });

      setExtractedData({
        entities: [
          { label: "Loại BĐS", value: "Căn hộ chung cư", confidence: 98 },
          { label: "Số phòng ngủ", value: apartment_meta.room_number ? `${apartment_meta.room_number} PN` : `${formData.rooms || "2"} PN`, confidence: 94 },
          { label: "Diện tích", value: apartment_meta.area_m2 ? `${apartment_meta.area_m2}m²` : "Chưa phát hiện", confidence: apartment_meta.area_m2 ? 93 : 25 },
          { label: "Giá thuê", value: listing.price_per_month ? `${listing.price_per_month.toLocaleString()} ₫/th` : "Chưa rõ", confidence: listing.price_per_month ? 96 : 20 },
          { label: "Tiện ích", value: `${apartment_meta.amenities.length} mục`, confidence: apartment_meta.amenities.length > 0 ? 92 : 30 },
          { label: "Trạng thái", value: listing.status === "Published" ? "Sẵn sàng đăng" : "Bản nháp", confidence: 90 },
        ],
        seoTitle: listing.title,
        seoDescription: listing.description,
        seoScore: validation.score,
        amenities: apartment_meta.amenities,
        imageTags: image_tags_suggested,
        validationStatus: validation.status,
        feedback: validation.feedback_to_owner,
        issues: validation.issues,
        missingFields: validation.missing_fields,
        isReal: true,
      });
      setValidationErrors(apiErrors);
      setAgentOnline(true);
    } else {
      setAgentOnline(false);
      setTimeout(() => runSimulation(formData), 800);
    }

    setIsVerifying(false);
    setVerificationDone(true);
  };

  const addMockImages = () => {
    setImages([
      { id: "img1", name: "phong-ngu.jpg", status: "ok" },
      { id: "img2", name: "phong-khach-toi.jpg", status: "error", errorMsg: "Ảnh quá tối (độ sáng < 30%) — AI khuyên chụp lại" },
      { id: "img3", name: "nha-bep.jpg", status: "warning", errorMsg: "Ảnh hơi mờ — cân nhắc chụp lại" },
      { id: "img4", name: "bathroom.jpg", status: "ok" },
    ]);
  };

  const errorForField = (field: string) => validationErrors.find(e => e.field === field);
  const applyAISuggestion = (field: string, suggestion: string) => {
    setFormData(f => ({ ...f, [field]: suggestion }));
    setValidationErrors(e => e.filter(v => v.field !== field));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Đăng tin cho thuê</h2>
        <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>Listing Verifier AI kiểm duyệt tự động</p>
      </div>
      <div className="p-6 max-w-2xl">
        {/* Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-700 font-semibold" style={{ fontSize: "0.875rem" }}>Bước {step}/3</p>
            <span className="text-violet-600" style={{ fontSize: "0.75rem" }}>{step === 1 ? "Thông tin cơ bản" : step === 2 ? "Tải ảnh" : "Xem lại"}</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(s => <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${step >= s ? "bg-violet-500" : "bg-gray-200"}`} />)}
          </div>
        </div>

        {/* Step 1 — Basic info */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-gray-700 mb-1.5 font-semibold" style={{ fontSize: "0.82rem" }}>Tiêu đề tin *</label>
              <input value={formData.title} onChange={e => { setFormData({ ...formData, title: e.target.value }); setValidationErrors(v => v.filter(x => x.field !== "title")); }}
                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${errorForField("title") ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-gray-50 focus:border-violet-400"}`}
                style={{ fontSize: "0.875rem" }} placeholder="VD: Căn hộ 2PN full nội thất, view đẹp, Q7" />
              {errorForField("title")?.suggestion && (
                <button onClick={() => applyAISuggestion("title", errorForField("title")!.suggestion!)}
                  className="mt-2 text-violet-600 hover:text-violet-700 underline" style={{ fontSize: "0.72rem" }}>
                  ✨ Dùng gợi ý: "{errorForField("title")!.suggestion}"
                </button>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-1.5 font-semibold" style={{ fontSize: "0.82rem" }}>Địa chỉ *</label>
              <input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-violet-400" style={{ fontSize: "0.875rem" }} placeholder="Số nhà, đường, phường, quận..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1.5 font-semibold" style={{ fontSize: "0.82rem" }}>Giá thuê (K/tháng)</label>
                <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${errorForField("price") ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-violet-400"}`}
                  style={{ fontSize: "0.875rem" }} placeholder="12000" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1.5 font-semibold" style={{ fontSize: "0.82rem" }}>Diện tích (m²)</label>
                <input value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-violet-400" style={{ fontSize: "0.875rem" }} placeholder="65" />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1.5 font-semibold" style={{ fontSize: "0.82rem" }}>Mô tả chi tiết *</label>
              <textarea value={formData.description} onChange={e => { setFormData({ ...formData, description: e.target.value }); setValidationErrors(v => v.filter(x => x.field !== "description")); }}
                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all resize-none ${errorForField("description") ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-gray-50 focus:border-violet-400"}`}
                style={{ fontSize: "0.875rem" }} rows={4} placeholder="Mô tả căn hộ, tiện ích..." />
              {errorForField("description")?.suggestion && (
                <button onClick={() => applyAISuggestion("description", errorForField("description")!.suggestion!)}
                  className="mt-2 text-violet-600 hover:text-violet-700 underline" style={{ fontSize: "0.72rem" }}>
                  ✨ Dùng mô tả AI
                </button>
              )}
            </div>

            {/* Agent status indicator */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={agentOnline === null ? { opacity: [1, 0.3, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className={`w-2 h-2 rounded-full ${agentOnline === null ? "bg-amber-400" : agentOnline ? "bg-emerald-500" : "bg-gray-400"}`}
                />
                <span className="text-gray-400" style={{ fontSize: "0.68rem" }}>
                  {agentOnline === null ? "Đang kiểm tra AI agent…" : agentOnline ? "Gemini 2.5-Flash • Online" : "Demo Mode • Backend offline"}
                </span>
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.96 }} onClick={triggerAIVerification} disabled={isVerifying}
              className={`w-full py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all ${isVerifying ? "border-violet-300 bg-violet-50 text-violet-500" : verificationDone && validationErrors.length === 0 ? "border-emerald-400 bg-emerald-50 text-emerald-600" : "border-violet-300 hover:border-violet-400 text-violet-600 hover:bg-violet-50"}`}
              style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              {isVerifying
                ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><RefreshCw size={16} /></motion.div>Listing Verifier đang xử lý NLP...</>
                : verificationDone && validationErrors.length === 0
                ? <><CheckCircle2 size={16} />Đã xác thực — Không có lỗi!</>
                : <><Sparkles size={16} />Kiểm tra bằng Listing Verifier AI</>}
            </motion.button>

            {extractedData && (
              <VerificationPanel
                extractedData={extractedData}
                onApplySuggestion={applyAISuggestion}
              />
            )}

            <button onClick={() => setStep(2)} className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-sm" style={{ fontSize: "0.9rem" }}>
              Tiếp theo — Tải ảnh
            </button>
          </motion.div>
        )}

        {/* Step 2 — Image upload */}
        {step === 2 && (
          <ImageUploadStep
            images={images}
            onAddMockImages={addMockImages}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {/* Step 3 — Review & publish */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setStep(2)} className="text-gray-400 hover:text-gray-600"><ChevronLeft size={18} /></button>
              <p className="text-gray-600 font-medium" style={{ fontSize: "0.85rem" }}>Xem lại & Xuất bản</p>
            </div>
            <div className="space-y-3">
              {[["Tiêu đề", formData.title || "—"], ["Địa chỉ", formData.address || "—"], ["Giá thuê", formData.price ? `${Number(formData.price).toLocaleString()} ₫/tháng` : "—"], ["Diện tích", formData.area ? `${formData.area}m²` : "—"]].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2.5 border-b border-gray-100">
                  <span className="text-gray-500" style={{ fontSize: "0.82rem" }}>{l}</span>
                  <span className="text-gray-900 font-semibold" style={{ fontSize: "0.82rem" }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-500" />
              <p className="text-emerald-700" style={{ fontSize: "0.78rem" }}>{images.filter(i => i.status === "ok").length} ảnh đạt chuẩn • Listing Verifier đã duyệt</p>
            </div>
            <button onClick={() => setStep(1)} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-2xl font-bold shadow-md" style={{ fontSize: "1rem" }}>
              🚀 Đăng tin ngay
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
