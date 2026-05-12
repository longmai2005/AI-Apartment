import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Upload, CheckCircle2, AlertTriangle, ChevronLeft,
  Sparkles, Camera, Info, RefreshCw, Bot,
} from "lucide-react";
import { verifyListing, buildRawText, checkAgentHealth, type VerifyListingData } from "@features/ai-service/listingVerifier";

type ExtractedData = {
  entities: { label: string; value: string; confidence: number }[];
  seoTitle: string;
  seoDescription: string;
  seoScore: number;
  amenities?: VerifyListingData["apartment_meta"]["amenities"];
  imageTags?: string[];
  validationStatus?: "Pass" | "Fail";
  feedback?: string;
  issues?: string[];
  missingFields?: string[];
  isReal?: boolean;
};

export default function ListingTab() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: "", address: "", price: "", area: "", rooms: "2", description: "" });
  const [images, setImages] = useState<Array<{ id: string; name: string; status: string; errorMsg?: string }>>([]);
  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; type: string; message: string; suggestion?: string }>>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [agentOnline, setAgentOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkAgentHealth().then(setAgentOnline);
  }, []);

  const runSimulation = useCallback((fd: typeof formData) => {
    const mockErrors: typeof validationErrors = [];
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
      const apiErrors: typeof validationErrors = [];
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
              {isVerifying ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><RefreshCw size={16} /></motion.div>Listing Verifier đang xử lý NLP...</> :
               verificationDone && validationErrors.length === 0 ? <><CheckCircle2 size={16} />Đã xác thực — Không có lỗi!</> :
               <><Sparkles size={16} />Kiểm tra bằng Listing Verifier AI</>}
            </motion.button>

            {/* NLP Extraction Results panel */}
            {extractedData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-violet-200 overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.04), rgba(99,102,241,0.02))" }}
              >
                <div className="px-5 py-3 border-b border-violet-100 flex items-center justify-between"
                  style={{ background: "rgba(139,92,246,0.06)" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                      <Bot size={12} className="text-violet-600" />
                    </div>
                    <span className="text-violet-700 font-bold" style={{ fontSize: "0.8rem" }}>
                      Listing Verifier — NLP Extraction
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full font-bold"
                      style={{
                        fontSize: "0.6rem",
                        background: extractedData.isReal ? "linear-gradient(90deg,#7c3aed,#4f46e5)" : "#e5e7eb",
                        color: extractedData.isReal ? "#fff" : "#6b7280",
                      }}
                    >
                      {extractedData.isReal ? "✦ AI Thật • Gemini 2.5-Flash" : "Demo Mode"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {extractedData.validationStatus && (
                      <span
                        className="px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                        style={{
                          fontSize: "0.65rem",
                          background: extractedData.validationStatus === "Pass" ? "#dcfce7" : "#fee2e2",
                          color: extractedData.validationStatus === "Pass" ? "#166534" : "#991b1b",
                        }}
                      >
                        {extractedData.validationStatus === "Pass" ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                        {extractedData.validationStatus === "Pass" ? "Hợp lệ" : "Cần sửa"}
                      </span>
                    )}
                    <span className="text-violet-500" style={{ fontSize: "0.65rem" }}>SEO</span>
                    <span
                      className="px-2 py-0.5 rounded-full font-bold"
                      style={{
                        fontSize: "0.72rem",
                        background: extractedData.seoScore >= 80 ? "#dcfce7" : extractedData.seoScore >= 60 ? "#fef9c3" : "#fee2e2",
                        color: extractedData.seoScore >= 80 ? "#166534" : extractedData.seoScore >= 60 ? "#854d0e" : "#991b1b",
                      }}
                    >
                      {extractedData.seoScore}/100
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {extractedData.feedback && (
                    <div className="rounded-xl border px-4 py-3 flex items-start gap-3"
                      style={{
                        background: extractedData.validationStatus === "Pass" ? "rgba(16,185,129,0.05)" : "rgba(245,158,11,0.05)",
                        borderColor: extractedData.validationStatus === "Pass" ? "#a7f3d0" : "#fde68a",
                      }}>
                      <Info size={14} className="flex-shrink-0 mt-0.5" style={{ color: extractedData.validationStatus === "Pass" ? "#059669" : "#d97706" }} />
                      <p style={{ fontSize: "0.78rem", lineHeight: 1.6, color: extractedData.validationStatus === "Pass" ? "#065f46" : "#92400e" }}>
                        <span className="font-bold">Gemini: </span>{extractedData.feedback}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                      THỰC THỂ TRÍCH XUẤT (NLP)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {extractedData.entities.map(({ label, value, confidence }) => (
                        <div key={label} className="rounded-xl bg-white border border-gray-100 px-3 py-2.5 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-400" style={{ fontSize: "0.62rem" }}>{label}</span>
                            <span
                              className="font-bold"
                              style={{
                                fontSize: "0.6rem",
                                color: confidence >= 80 ? "#10b981" : confidence >= 50 ? "#f59e0b" : "#ef4444",
                              }}
                            >
                              {confidence}%
                            </span>
                          </div>
                          <p className="text-gray-800 font-semibold" style={{ fontSize: "0.78rem" }}>{value}</p>
                          <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-1 rounded-full transition-all"
                              style={{
                                width: `${confidence}%`,
                                background: confidence >= 80
                                  ? "linear-gradient(90deg,#10b981,#34d399)"
                                  : confidence >= 50
                                  ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                                  : "linear-gradient(90deg,#ef4444,#f87171)",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {extractedData.amenities && extractedData.amenities.length > 0 && (
                    <div>
                      <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                        TIỆN ÍCH PHÁT HIỆN (GEMINI)
                      </p>
                      {(["Furniture", "Building", "Policy"] as const).map((cat) => {
                        const items = extractedData.amenities!.filter((a) => a.category === cat);
                        if (!items.length) return null;
                        const catLabel = cat === "Furniture" ? "Nội thất" : cat === "Building" ? "Toà nhà" : "Chính sách";
                        const catColor = cat === "Furniture" ? "#7c3aed" : cat === "Building" ? "#0284c7" : "#059669";
                        const catBg = cat === "Furniture" ? "rgba(124,58,237,0.08)" : cat === "Building" ? "rgba(2,132,199,0.08)" : "rgba(5,150,105,0.08)";
                        return (
                          <div key={cat} className="mb-2">
                            <span className="inline-flex items-center gap-1 mb-1.5 px-2 py-0.5 rounded-full font-semibold"
                              style={{ fontSize: "0.6rem", background: catBg, color: catColor }}>
                              {catLabel}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {items.map((a) => (
                                <span key={a.amenities_name}
                                  className="px-2.5 py-1 rounded-lg bg-white border text-gray-700 font-medium"
                                  style={{ fontSize: "0.72rem", borderColor: `${catColor}30` }}>
                                  {a.amenities_name}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {extractedData.imageTags && extractedData.imageTags.length > 0 && (
                    <div>
                      <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                        GỢI Ý TAG ẢNH (AI)
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {extractedData.imageTags.map((tag) => (
                          <span key={tag}
                            className="px-2.5 py-1 rounded-lg font-medium"
                            style={{ fontSize: "0.7rem", background: "rgba(139,92,246,0.1)", color: "#5b21b6" }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                      TIÊU ĐỀ SEO TỰ ĐỘNG
                    </p>
                    <div className="rounded-xl bg-white border border-emerald-200 px-4 py-3 flex items-center justify-between gap-3">
                      <p className="text-gray-800 font-semibold flex-1" style={{ fontSize: "0.82rem", lineHeight: 1.4 }}>
                        {extractedData.seoTitle}
                      </p>
                      <button
                        onClick={() => applyAISuggestion("title", extractedData.seoTitle)}
                        className="flex-shrink-0 text-emerald-600 hover:text-emerald-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Dùng ngay
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                      MÔ TẢ SEO TỰ ĐỘNG
                    </p>
                    <div className="rounded-xl bg-white border border-emerald-200 px-4 py-3 flex items-start justify-between gap-3">
                      <p className="text-gray-700 flex-1" style={{ fontSize: "0.78rem", lineHeight: 1.65 }}>
                        {extractedData.seoDescription}
                      </p>
                      <button
                        onClick={() => applyAISuggestion("description", extractedData.seoDescription)}
                        className="flex-shrink-0 text-emerald-600 hover:text-emerald-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors mt-0.5"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Dùng ngay
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <button onClick={() => setStep(2)} className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-sm" style={{ fontSize: "0.9rem" }}>
              Tiếp theo — Tải ảnh
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600"><ChevronLeft size={18} /></button>
              <p className="text-gray-600 font-medium" style={{ fontSize: "0.85rem" }}>Tải ảnh — AI kiểm duyệt theo thời gian thực</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
              <Sparkles size={15} className="text-blue-500 flex-shrink-0" />
              <p className="text-blue-700" style={{ fontSize: "0.78rem" }}>AI kiểm tra độ sáng, độ nét và nội dung ảnh</p>
            </div>
            <button onClick={addMockImages}
              className="w-full border-2 border-dashed border-violet-300 rounded-2xl py-8 flex flex-col items-center gap-2 hover:border-violet-400 hover:bg-violet-50/50 transition-all">
              <Upload size={24} className="text-violet-400" />
              <p className="text-gray-700 font-semibold" style={{ fontSize: "0.875rem" }}>Chọn ảnh từ máy</p>
              <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>JPG, PNG — Tối đa 10 ảnh</p>
            </button>
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {images.map(img => (
                  <div key={img.id} className={`relative rounded-xl overflow-hidden border-2 ${img.status === "ok" ? "border-emerald-400" : img.status === "error" ? "border-red-400" : img.status === "warning" ? "border-amber-400" : "border-gray-200"}`}>
                    <div className="aspect-square bg-gray-100 flex items-center justify-center"><Camera size={22} className="text-gray-400" /></div>
                    {img.status === "ok" && <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"><CheckCircle2 size={12} className="text-white" /></div>}
                    {(img.status === "error" || img.status === "warning") && img.errorMsg && (
                      <div className={`absolute bottom-0 left-0 right-0 p-2 text-white ${img.status === "error" ? "bg-red-500/90" : "bg-amber-500/90"}`} style={{ fontSize: "0.6rem" }}>{img.errorMsg}</div>
                    )}
                    <p className="absolute top-2 left-2 bg-black/50 text-white px-1.5 py-0.5 rounded" style={{ fontSize: "0.6rem" }}>{img.name.split('.')[0]}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600" style={{ fontSize: "0.875rem" }}>Quay lại</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-2.5 rounded-xl font-semibold" style={{ fontSize: "0.875rem" }}>Tiếp theo</button>
            </div>
          </motion.div>
        )}

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
