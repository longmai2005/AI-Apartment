import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import {
  Building2, Star, Shield, Zap, Bot,
  MessageSquare, BarChart3, CheckCircle2, ArrowRight,
  Search, MapPin, Home, Smartphone, ChevronRight,
  TrendingUp, Bell, FileText, Play,
  Sun, Moon, Lock, Eye, Key, Database, Activity,
  Users, X, UserPlus, LogIn, Globe,
} from "lucide-react";
import { ChatWidget } from "../components/ChatWidget";
import { useLang } from "../../hooks/useLang";

// ─── Listing images ────────────────────────────────────────────────────
const IMG_APT_1 = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=75&fit=crop";
const IMG_APT_2 = "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=75&fit=crop";
const IMG_APT_3 = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=75&fit=crop";
const IMG_APT_4 = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=75&fit=crop";
const IMG_APT_5 = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=75&fit=crop";
const IMG_APT_6 = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=75&fit=crop";
const IMG_APT_7 = "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&q=75&fit=crop";
const IMG_APT_8 = "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&q=75&fit=crop";

const LISTINGS = [
  { id: 1, img: IMG_APT_1, name: "Vinhomes Grand Park", district: "TP. Thủ Đức", priceFrom: 8.5, priceTo: 15, available: 4, area: "45–85 m²", rating: 4.9, badge: "Mới nhất", badgeHex: "#10b981", amenities: ["Hồ bơi", "Gym", "Bãi xe"] },
  { id: 2, img: IMG_APT_2, name: "Masteri Centre Point", district: "TP. Thủ Đức", priceFrom: 12, priceTo: 22, available: 2, area: "60–120 m²", rating: 4.8, badge: "Cao cấp", badgeHex: "#8b5cf6", amenities: ["Sky Bar", "Hồ bơi", "Concierge"] },
  { id: 3, img: IMG_APT_3, name: "The Estella Heights", district: "TP.HCM", priceFrom: 18, priceTo: 35, available: 1, area: "85–150 m²", rating: 4.7, badge: "Sang trọng", badgeHex: "#f59e0b", amenities: ["Concierge", "Gym", "Spa"] },
  { id: 4, img: IMG_APT_4, name: "Eco Green Saigon", district: "TP.HCM", priceFrom: 7, priceTo: 13, available: 6, area: "40–75 m²", rating: 4.6, badge: "Còn nhiều phòng", badgeHex: "#06b6d4", amenities: ["Cây xanh", "Gym", "Bãi xe"] },
  { id: 5, img: IMG_APT_5, name: "Sunwah Pearl", district: "Bình Thạnh", priceFrom: 14, priceTo: 28, available: 3, area: "60–110 m²", rating: 4.8, badge: "Hot Deal", badgeHex: "#ef4444", amenities: ["Sky Pool", "Gym", "Business Ctr"] },
  { id: 6, img: IMG_APT_6, name: "Gateway Thảo Điền", district: "TP. Thủ Đức", priceFrom: 11, priceTo: 20, available: 5, area: "50–95 m²", rating: 4.6, badge: "View sông", badgeHex: "#3b82f6", amenities: ["Hồ bơi", "Gym", "Bãi xe"] },
  { id: 7, img: IMG_APT_7, name: "Riviera Point", district: "Quận 7", priceFrom: 15, priceTo: 30, available: 2, area: "70–130 m²", rating: 4.7, badge: "Cao cấp", badgeHex: "#8b5cf6", amenities: ["Hồ bơi", "Concierge", "Spa"] },
  { id: 8, img: IMG_APT_8, name: "Botanica Premier", district: "Tân Bình", priceFrom: 9, priceTo: 17, available: 7, area: "45–80 m²", rating: 4.5, badge: "Còn nhiều", badgeHex: "#06b6d4", amenities: ["Cây xanh", "Hồ bơi", "Gym"] },
];

const AGENTS = [
  { id: 1, name: "Listing Verifier", icon: Shield, g: "from-blue-500 to-cyan-400", desc: "Kiểm duyệt NLP + Vision AI, sinh SEO copy tự động" },
  { id: 2, name: "Super Broker", icon: MessageSquare, g: "from-emerald-500 to-teal-400", desc: "Tư vấn conversational search 24/7, RAG + chốt lịch hẹn" },
  { id: 3, name: "Smart Concierge", icon: Zap, g: "from-violet-500 to-purple-400", desc: "Triage sự cố, dispatch kỹ thuật, theo dõi SLA" },
  { id: 4, name: "Contract & Admin", icon: BarChart3, g: "from-orange-500 to-amber-400", desc: "Hóa đơn VietQR, reconcile thanh toán, báo cáo dòng tiền" },
];

const AGENT_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];
const AGENT_METRICS = [
  { val: "234", label: "Listings duyệt hôm nay", sub: "12 bị từ chối tự động" },
  { val: "1,204", label: "Phiên tư vấn AI", sub: "Avg. reply: 1.2s" },
  { val: "89", label: "Tickets xử lý", sub: "SLA đạt: 97.8%" },
  { val: "156", label: "Hóa đơn xuất", sub: "0 sai sót tính toán" },
];
const AGENT_LOGS = [
  { agent: "Listing Verifier", msg: "Duyệt xong #L-2204 — NLP OK, 4/4 ảnh đạt chuẩn → Đã đăng lên sàn", color: "#3b82f6" },
  { agent: "Super Broker", msg: "Tư vấn khách 2PN Q7 <12M — RAG gợi ý 3 lựa chọn, chốt lịch hẹn Thứ 7", color: "#10b981" },
  { agent: "Smart Concierge", msg: "Ticket T-089: Điều hoà hỏng T8 — Gán kỹ thuật viên Minh, SLA còn 2h45p", color: "#8b5cf6" },
  { agent: "Contract Agent", msg: "Xuất 156 hóa đơn T5 — VietQR đính kèm, gửi email xong 100%", color: "#f59e0b" },
  { agent: "Listing Verifier", msg: "Phát hiện watermark #IMG-0392 — Từ chối tự động, yêu cầu chủ nhà chụp lại", color: "#3b82f6" },
  { agent: "Super Broker", msg: "Khách VIP hỏi 3PN Thảo Điền — Kết nối chủ nhà, tour ảo 8h sáng mai", color: "#10b981" },
  { agent: "Smart Concierge", msg: "Ticket T-090 đóng — Xử lý trong 2h47p, cư dân đánh giá 5⭐", color: "#8b5cf6" },
  { agent: "Contract Agent", msg: "Webhook: P.1204 thanh toán 11.5M ₫ — Gạch nợ & gửi biên nhận tự động", color: "#f59e0b" },
];

const HOW = [
  { step: "01", title: "Mô tả nhu cầu", desc: "Nhắn tin cho AI Super Broker như nói chuyện bình thường — AI hiểu ngữ cảnh, lọc chính xác", icon: MessageSquare, color: "#22d3ee" },
  { step: "02", title: "Xem & Đặt lịch", desc: "Nhận đề xuất cá nhân hóa, xem nhà thực tế hoặc virtual tour, đặt lịch ngay trong app", icon: Home, color: "#34d399" },
  { step: "03", title: "Ký HĐ & Quản lý", desc: "Ký hợp đồng điện tử, thanh toán online, theo dõi sự cố và hóa đơn mọi lúc mọi nơi", icon: FileText, color: "#a78bfa" },
];

const STATS = [
  { label: "Căn hộ trên nền tảng", value: "12,400+", icon: Building2, color: "#22d3ee" },
  { label: "Khách thuê hài lòng", value: "98%", icon: Star, color: "#fbbf24" },
  { label: "AI Agents hoạt động", value: "4", icon: Bot, color: "#a78bfa" },
  { label: "Giao dịch/tháng", value: "3,200+", icon: CheckCircle2, color: "#34d399" },
];

const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: "TLS 1.3 & HTTPS",
    desc: "Toàn bộ dữ liệu mã hóa end-to-end. A+ SSL Rating — không có plaintext nào truyền qua đường mạng.",
    color: "#ef4444",
    tag: "A+ Rating",
  },
  {
    icon: Shield,
    title: "OWASP Top 10 Hardened",
    desc: "Phòng chống SQLi, XSS, CSRF, IDOR, Broken Auth và Broken Access Control theo chuẩn OWASP 2021.",
    color: "#f97316",
    tag: "Compliant",
  },
  {
    icon: Eye,
    title: "WAF & DDoS Protection",
    desc: "Web Application Firewall lọc request độc hại, rate limiting theo IP và bot mitigation tự động.",
    color: "#eab308",
    tag: "Always-on",
  },
  {
    icon: Key,
    title: "Zero-Trust Auth",
    desc: "JWT + rotating refresh token, bcrypt password hashing, session invalidation & brute-force lockout.",
    color: "#22d3ee",
    tag: "Secure",
  },
  {
    icon: Database,
    title: "Encryption at Rest",
    desc: "AES-256 mã hóa dữ liệu nhạy cảm tại tầng DB — CCCD, hợp đồng, thông tin cá nhân người dùng.",
    color: "#a78bfa",
    tag: "AES-256",
  },
  {
    icon: Activity,
    title: "SIEM Monitoring 24/7",
    desc: "Giám sát real-time, anomaly detection, cảnh báo tức thì khi phát hiện hành vi bất thường.",
    color: "#34d399",
    tag: "24/7",
  },
];

const OWASP_TOP10 = [
  { id: "A01", name: "Broken Access Control" },
  { id: "A02", name: "Cryptographic Failures" },
  { id: "A03", name: "Injection (SQLi/XSS)" },
  { id: "A04", name: "Insecure Design" },
  { id: "A05", name: "Security Misconfiguration" },
  { id: "A06", name: "Vulnerable Components" },
  { id: "A07", name: "Auth & Identity Failures" },
  { id: "A08", name: "Software Integrity Failures" },
  { id: "A09", name: "Logging & Monitoring" },
  { id: "A10", name: "SSRF" },
];

// ─── Floating particles ─────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: (i * 17.3 + 5) % 100,
  top: (i * 23.7 + 9) % 100,
  size: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
  color:
    i % 4 === 0 ? "rgba(34,211,238,0.35)"
    : i % 4 === 1 ? "rgba(167,139,250,0.35)"
    : i % 4 === 2 ? "rgba(52,211,153,0.30)"
    : "rgba(148,163,184,0.25)",
  duration: 9 + (i % 6) * 2.5,
  delay: i * 0.38,
  xRange: (i % 2 === 0 ? 1 : -1) * (6 + (i % 5) * 3),
  yRange: -(18 + (i % 6) * 7),
}));

function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, background: p.color }}
          animate={{ y: [0, p.yRange, 0], x: [0, p.xRange, 0], opacity: [0, 0.8, 0] }}
          transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── AI Control Room ────────────────────────────────────────────────────────
function AgentControlRoom() {
  const [aiTick, setAiTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setAiTick(i => i + 1), 2600);
    return () => clearInterval(t);
  }, []);
  const aiProcIdx = aiTick % 4;
  const logEntries = Array.from({ length: 5 }, (_, i) => AGENT_LOGS[(aiTick + i) % AGENT_LOGS.length]);

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-cyan-500/8 border border-cyan-500/15 rounded-full px-4 py-1.5 mb-4">
          <Bot size={13} className="text-cyan-400" />
          <span className="text-cyan-400" style={{ fontSize: "0.73rem", fontWeight: 700, letterSpacing: "0.08em" }}>
            MULTI-AGENT AI ARCHITECTURE
          </span>
        </div>
        <h2 className="text-white mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
          AI Control Room · 4 agents · 24/7
        </h2>
        <p className="text-white/40 max-w-2xl mx-auto" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
          Kiến trúc đa tác nhân phân tán — mỗi Agent chuyên trách một nghiệp vụ, giao tiếp
          qua event-driven để xử lý xuyên suốt vòng đời hợp đồng thuê nhà
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl overflow-hidden border border-white/8"
        style={{ background: "rgba(5,8,18,0.9)", backdropFilter: "blur(24px)" }}
      >
        {/* Terminal title bar */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b border-white/6"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-white/25 font-mono" style={{ fontSize: "0.68rem" }}>
              nestavietai — agent-orchestrator · v2.1.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400/50 font-mono" style={{ fontSize: "0.62rem" }}>
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>

        {/* Agent cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/5">
          {AGENTS.map((agent, i) => {
            const isProc = aiProcIdx === i;
            const col = AGENT_COLORS[i];
            const m = AGENT_METRICS[i];
            return (
              <div
                key={agent.id}
                className="p-5 relative transition-colors duration-500"
                style={{ background: isProc ? "rgba(255,255,255,0.03)" : "transparent" }}
              >
                {isProc && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${col}15 0%, transparent 70%)` }}
                  />
                )}
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.g} flex items-center justify-center transition-all duration-500`}
                      style={{ boxShadow: isProc ? `0 0 22px ${col}55` : "none" }}
                    >
                      <agent.icon size={18} className="text-white" />
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full transition-all duration-500"
                      style={{
                        background: isProc ? `${col}20` : "rgba(52,211,153,0.1)",
                        fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.05em",
                        color: isProc ? col : "#34d399",
                      }}
                    >
                      <motion.span
                        animate={isProc ? { opacity: [1, 0.15, 1] } : { opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 0.7 }}
                        style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "currentColor" }}
                      />
                      {isProc ? "PROC..." : "ONLINE"}
                    </div>
                  </div>

                  <p className="text-white/22 mb-0.5" style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                    AGENT {agent.id}
                  </p>
                  <p className="text-white font-bold mb-1.5" style={{ fontSize: "0.9rem" }}>
                    {agent.name}
                  </p>
                  <p className="text-white/30 mb-4" style={{ fontSize: "0.68rem", lineHeight: 1.55 }}>
                    {agent.desc}
                  </p>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                    <p
                      className="font-extrabold transition-colors duration-500"
                      style={{
                        fontSize: "1.5rem",
                        letterSpacing: "-0.03em",
                        color: isProc ? col : "rgba(255,255,255,0.88)",
                      }}
                    >
                      {m.val}
                    </p>
                    <p className="text-white/28" style={{ fontSize: "0.6rem" }}>{m.label}</p>
                    <p style={{ fontSize: "0.58rem", color: col, opacity: 0.55, marginTop: "2px" }}>{m.sub}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Event stream */}
        <div className="border-t border-white/5 px-6 py-4" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Activity size={12} className="text-white/22" />
            <span className="text-white/22 font-mono" style={{ fontSize: "0.62rem", letterSpacing: "0.08em" }}>
              EVENT STREAM · LIVE
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400/35 font-mono" style={{ fontSize: "0.58rem" }}>streaming</span>
            </div>
          </div>
          <div className="space-y-1.5">
            {logEntries.map((log, i) => (
              <div
                key={i}
                className="flex items-start gap-3 font-mono"
                style={{ fontSize: "0.68rem", opacity: 1 - i * 0.17 }}
              >
                <span className="text-white/18 flex-shrink-0 tabular-nums" style={{ minWidth: "2.8rem" }}>
                  {String((aiTick * 7 + i * 11) % 60).padStart(2, "0")}:{String((aiTick * 13 + i * 17 + 23) % 60).padStart(2, "0")}
                </span>
                <span className="flex-shrink-0 font-bold" style={{ color: log.color, minWidth: "7rem", opacity: 0.75 }}>
                  [{log.agent.split(" ").slice(0, 2).join(" ")}]
                </span>
                <span className="text-white/32 flex-1 min-w-0 truncate">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Get Started Modal ────────────────────────────────────────────────────────
function GetStartedModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const roles = [
    {
      key: "tenant",
      icon: Home,
      gradient: "from-emerald-500 to-cyan-500",
      glow: "rgba(16,185,129,0.25)",
      title: "Cư dân / Người thuê",
      desc: "Tìm phòng thuê bằng AI, đặt lịch xem, quản lý hóa đơn & hợp đồng",
      features: ["Tìm phòng bằng Super Broker AI", "Chat & đặt lịch trực tiếp", "Quản lý hóa đơn VietQR"],
      register: "/tenant/register",
      login: "/tenant/login",
    },
    {
      key: "landlord",
      icon: Building2,
      gradient: "from-violet-500 to-purple-600",
      glow: "rgba(139,92,246,0.25)",
      title: "Chủ nhà / Quản lý",
      desc: "Đăng tin cho thuê, quản lý cư dân & doanh thu với 4 AI Agents",
      features: ["Listing Verifier kiểm duyệt tự động", "Dashboard doanh thu real-time", "Smart Concierge 24/7"],
      register: "/landlord/register",
      login: "/landlord/login",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 16 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-white/50 mb-1" style={{ fontSize: "0.8rem", letterSpacing: "0.12em" }}>CHÀO MỪNG ĐẾN VỚI</p>
            <h2 className="text-white font-black" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", letterSpacing: "-0.03em" }}>
              NestaViet<span style={{ color: "#a78bfa" }}>AI</span>
            </h2>
            <p className="text-white/40 mt-1" style={{ fontSize: "0.85rem" }}>Bạn muốn sử dụng với tư cách gì?</p>
          </motion.div>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {roles.map((role, i) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.key}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, type: "spring", stiffness: 240, damping: 24 }}
                className="rounded-2xl overflow-hidden border border-white/10"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                {/* Card header */}
                <div className={`bg-gradient-to-br ${role.gradient} p-5`}
                  style={{ boxShadow: `0 8px 32px ${role.glow}` }}>
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold" style={{ fontSize: "1rem" }}>{role.title}</h3>
                  <p className="text-white/70 mt-1" style={{ fontSize: "0.78rem", lineHeight: 1.5 }}>{role.desc}</p>
                </div>
                {/* Features */}
                <div className="p-4 space-y-2">
                  {role.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-white/40 flex-shrink-0" />
                      <span className="text-white/60" style={{ fontSize: "0.75rem" }}>{f}</span>
                    </div>
                  ))}
                </div>
                {/* Actions */}
                <div className="px-4 pb-4 flex gap-2">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(role.register)}
                    className={`flex-1 py-2.5 rounded-xl text-white font-bold flex items-center justify-center gap-1.5 bg-gradient-to-r ${role.gradient}`}
                    style={{ fontSize: "0.8rem" }}>
                    <UserPlus size={14} />Đăng ký mới
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(role.login)}
                    className="px-4 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors flex items-center gap-1.5"
                    style={{ fontSize: "0.8rem" }}>
                    <LogIn size={14} />Đăng nhập
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Close */}
        <div className="text-center">
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5 mx-auto" style={{ fontSize: "0.8rem" }}>
            <X size={14} />Đóng lại
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLang("landing");
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeApt, setActiveApt] = useState(0);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [chatTrigger, setChatTrigger] = useState<{ query: string; id: number } | undefined>();
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("nv-theme") !== "light";
    } catch {
      return true;
    }
  });

  const { scrollY } = useScroll();
  const heroGlow1Y = useTransform(scrollY, [0, 600], [0, -130]);
  const heroGlow2Y = useTransform(scrollY, [0, 600], [0, -70]);
  const heroTitleY = useSpring(useTransform(scrollY, [0, 400], [0, -40]), { stiffness: 80, damping: 20 });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveApt((i) => (i + 1) % LISTINGS.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
    try {
      localStorage.setItem("nv-theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ backgroundColor: "var(--nv-bg)" }}
    >
      {/* Get Started Modal */}
      <AnimatePresence>
        {showGetStarted && <GetStartedModal onClose={() => setShowGetStarted(false)} />}
      </AnimatePresence>

      <FloatingParticles />

      {/* Liquid glass aurora background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "55%", height: "70%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,211,238,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "30%", right: "-15%", width: "50%", height: "60%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "20%", width: "60%", height: "50%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(52,211,153,0.05) 0%, transparent 70%)", filter: "blur(70px)" }} />
      </div>

      {/* Global subtle dot grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(${isDark ? "rgba(148,163,184,0.028)" : "rgba(7,16,32,0.035)"} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── NAVBAR ──────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(7,11,22,0.72)"
            : "rgba(7,11,22,0.45)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(255,255,255,0.04)",
          boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.35)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 select-none flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30"
              style={{ border: "1px solid rgba(255,255,255,0.18)" }}>
              <Building2 size={16} className="text-white" />
            </div>
            <span style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.04em" }}>
              NestaViet<span className="text-cyan-400">AI</span>
            </span>
          </button>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {[
              { label: "Căn hộ", href: null },
              { label: "Tính năng", href: null },
              { label: "Bảo mật", href: "/security" },
              { label: "Tải app", href: null },
            ].map(({ label, href }) => (
              <button
                key={label}
                onClick={() => href && navigate(href)}
                className="px-4 py-2 rounded-lg text-white/50 hover:text-white/85 hover:bg-white/6 transition-all"
                style={{ fontSize: "0.85rem" }}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* CTAs + Theme toggle */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Theme toggle */}
            <button
              onClick={() => setIsDark((d) => !d)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/45 hover:text-white/80 hover:bg-white/6 transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.09)" }}
              title={isDark ? "Chế độ sáng" : "Chế độ tối"}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="hidden sm:flex items-center gap-1 w-8 h-8 rounded-lg justify-center text-white/45 hover:text-white/80 hover:bg-white/6 transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.09)", fontSize: "0.68rem", fontWeight: 700 }}
              title={lang === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
            >
              {lang === "vi" ? "EN" : "VI"}
            </button>

            {/* Tenant login */}
            <button
              onClick={() => navigate("/tenant/login")}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-white/70 hover:text-white transition-all"
              style={{ fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)" }}
            >
              {t("Cư dân", "Tenant")}
            </button>

            {/* Landlord login */}
            <button
              onClick={() => navigate("/landlord/login")}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-violet-300 hover:text-white transition-all"
              style={{ fontSize: "0.8rem", border: "1px solid rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.08)" }}
            >
              {t("Chủ nhà", "Landlord")}
            </button>

            {/* Portal dropdown — Manager / Dev / Admin */}
            <div className="relative group hidden sm:block">
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-white/40 hover:text-white/70 transition-all"
                style={{ fontSize: "0.78rem", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
              >
                <Globe size={12} />
                {t("Cổng khác", "Portals")}
              </button>
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/10 shadow-2xl overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all"
                style={{ background: "rgba(8,16,28,0.97)", backdropFilter: "blur(16px)" }}
              >
                {[
                  { label: t("Quản lý toà nhà", "Building Manager"), sub: "manager.nestaviet.vn", path: "/manager/login", color: "text-emerald-400" },
                  { label: t("Developer Portal", "Developer Portal"), sub: "dev.nestaviet.vn",     path: "/dev/login",     color: "text-blue-400" },
                  { label: t("Admin Portal", "Admin Portal"),         sub: "admin.nestaviet.vn",   path: "/admin/login",   color: "text-violet-400" },
                ].map((p) => (
                  <button
                    key={p.path}
                    onClick={() => navigate(p.path)}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/6 last:border-0"
                  >
                    <p className={`font-semibold ${p.color}`} style={{ fontSize: "0.8rem" }}>{p.label}</p>
                    <p className="text-white/25 font-mono mt-0.5" style={{ fontSize: "0.62rem" }}>{p.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Main CTA */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowGetStarted(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
              style={{
                fontSize: "0.83rem",
                background: "linear-gradient(135deg, #22d3ee, #3b82f6)",
                boxShadow: "0 0 18px rgba(34,211,238,0.28)",
              }}
            >
              Bắt đầu
              <ArrowRight size={13} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center" style={{ paddingTop: "5rem" }}>
        {/* Ambient glows — parallax on scroll */}
        <motion.div
          style={{ y: heroGlow1Y }}
          className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full pointer-events-none"
          animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        >
          <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.09) 0%, transparent 65%)", transform: "translate(-30%, -20%)" }} />
        </motion.div>
        <motion.div
          style={{ y: heroGlow2Y }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }}
        >
          <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle, rgba(167,139,250,0.09) 0%, transparent 65%)", transform: "translate(30%, 20%)" }} />
        </motion.div>

        {/* Floating orbs */}
        <div className="absolute top-[15%] left-[8%] w-28 h-28 rounded-full pointer-events-none nv-orb-1"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 70%)", filter: "blur(8px)" }} />
        <div className="absolute top-[55%] right-[6%] w-36 h-36 rounded-full pointer-events-none nv-orb-2"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 70%)", filter: "blur(10px)" }} />
        <div className="absolute bottom-[20%] left-[18%] w-20 h-20 rounded-full pointer-events-none nv-orb-3"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.2) 0%, transparent 70%)", filter: "blur(6px)" }} />
        <div className="absolute top-[30%] right-[22%] w-16 h-16 rounded-full pointer-events-none nv-orb-1"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.14) 0%, transparent 70%)", filter: "blur(6px)", animationDelay: "3s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
          {/* LEFT: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04]"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="text-white/65" style={{ fontSize: "0.77rem", fontWeight: 500 }}>
                Nền tảng PropTech hàng đầu Việt Nam 2025
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              style={{
                fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)",
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: "-0.04em",
                y: heroTitleY,
              }}
              className="text-white mb-5"
            >
              Nền tảng
              <br />
              <span
                style={{
                  background: "linear-gradient(100deg, #22d3ee 0%, #818cf8 50%, #34d399 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                quản lý & cho thuê
              </span>
              <br />
              căn hộ thông minh
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="text-white/50 mb-8 max-w-lg"
              style={{ fontSize: "1.05rem", lineHeight: 1.75 }}
            >
              Hệ thống Multi-Agent AI tự động hóa toàn bộ quy trình — từ kiểm duyệt,
              tư vấn khách hàng đến quản lý hợp đồng và thu tiền không cần nhân sự thủ công.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
              className="relative mb-7"
            >
              <div className="flex gap-2">
                <div
                  className="flex items-center gap-3 flex-1 rounded-xl px-4 py-3 border transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderColor: searchFocused ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.1)",
                    boxShadow: searchFocused ? "0 0 0 3px rgba(34,211,238,0.07)" : "none",
                  }}
                >
                  <Search size={16} className="text-white/30 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Nhập địa điểm, tên chung cư..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const q = searchQuery.trim();
                        if (!q) { navigate("/tenant"); return; }
                        const match = LISTINGS.find((l) => l.name.toLowerCase().includes(q.toLowerCase()) || l.district.toLowerCase().includes(q.toLowerCase()));
                        if (match) navigate("/tenant");
                        else navigate("/tenant");
                      }
                    }}
                    className="bg-transparent flex-1 text-white placeholder-white/25 outline-none"
                    style={{ fontSize: "0.88rem" }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-white/30 hover:text-white/60 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  )}
                </div>
                <button
                  onClick={() => navigate("/tenant")}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity flex-shrink-0"
                  style={{ fontSize: "0.85rem", background: "linear-gradient(135deg, #22d3ee, #3b82f6)", boxShadow: "0 0 20px rgba(34,211,238,0.2)" }}
                >
                  <Search size={14} />
                  Tìm kiếm
                </button>
              </div>

              {/* Search results dropdown */}
              {searchFocused && searchQuery.trim().length >= 2 && (() => {
                const q = searchQuery.trim().toLowerCase();
                const results = LISTINGS.filter((l) =>
                  l.name.toLowerCase().includes(q) ||
                  l.district.toLowerCase().includes(q) ||
                  l.amenities.some((a) => a.toLowerCase().includes(q))
                );
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-white/12 overflow-hidden z-50"
                    style={{ background: "rgba(10,16,32,0.97)", backdropFilter: "blur(20px)" }}
                  >
                    {results.length > 0 ? (
                      <>
                        <div className="px-4 py-2.5 border-b border-white/8">
                          <span className="text-white/40" style={{ fontSize: "0.72rem" }}>{results.length} kết quả phù hợp</span>
                        </div>
                        {results.map((apt) => (
                          <button key={apt.id} onClick={() => { setSearchQuery(apt.name); navigate("/tenant"); }}
                            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                          >
                            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                              <img src={apt.img} alt={apt.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white" style={{ fontSize: "0.85rem", fontWeight: 600 }}>{apt.name}</p>
                              <p className="text-white/45 flex items-center gap-1" style={{ fontSize: "0.72rem" }}>
                                <MapPin size={10} />{apt.district} • {apt.priceFrom}–{apt.priceTo}M/tháng
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <span className="inline-block px-2 py-0.5 rounded-full" style={{ background: apt.badgeHex + "22", color: apt.badgeHex, fontSize: "0.62rem", fontWeight: 600 }}>{apt.badge}</span>
                              <p className="text-white/35 mt-0.5" style={{ fontSize: "0.65rem" }}>{apt.available} phòng trống</p>
                            </div>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="px-4 py-3 border-b border-white/8">
                        <p className="text-white/50" style={{ fontSize: "0.8rem" }}>Không tìm thấy "{searchQuery}" trong danh sách</p>
                        <p className="text-white/30 mt-0.5" style={{ fontSize: "0.72rem" }}>Hỏi AI Super Broker để tìm thêm lựa chọn</p>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        const q = searchQuery.trim();
                        setChatTrigger({ query: `Tôi đang tìm căn hộ tại ${q}. Bạn có thể tư vấn giúp tôi không?`, id: Date.now() });
                        setSearchFocused(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-500/8 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-cyan-400" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                        <Bot size={15} />
                        {results.length === 0 ? `Hỏi AI Super Broker về "${searchQuery}"` : `Hỏi AI về "${searchQuery}"`}
                      </span>
                      <ChevronRight size={14} className="text-cyan-400/60" />
                    </button>
                  </motion.div>
                );
              })()}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <button
                onClick={() => navigate("/tenant/register")}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
                style={{
                  fontSize: "0.9rem",
                  background: "linear-gradient(135deg, #34d399, #22d3ee)",
                  boxShadow: "0 0 20px rgba(52,211,153,0.2)",
                }}
              >
                Đăng ký miễn phí
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate("/tenant")}
                className="flex items-center gap-2 text-white/55 hover:text-white/80 transition-colors"
                style={{ fontSize: "0.88rem" }}
              >
                <Play size={14} className="text-violet-400" />
                Xem demo
              </button>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-5 text-white/35"
              style={{ fontSize: "0.78rem" }}
            >
              {[
                { sym: "★", label: "4.9 App Store" },
                { sym: "★", label: "4.8 Google Play" },
                { sym: "✓", label: "12,400+ căn hộ đã xác thực" },
              ].map(({ sym, label }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className="text-cyan-400/70">{sym}</span>
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Floating apartment cards */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22, duration: 0.6 }}
            className="hidden lg:block relative h-[520px]"
          >
            {/* Main card */}
            <div
              className="absolute inset-x-0 top-6 rounded-2xl overflow-hidden border border-white/8 shadow-2xl"
              style={{ background: "var(--nv-surface)" }}
            >
              <div className="relative h-52 overflow-hidden">
                {LISTINGS.map((apt, i) => (
                  <motion.img
                    key={apt.id}
                    src={apt.img}
                    alt={apt.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                    animate={{ opacity: i === activeApt ? 1 : 0 }}
                    transition={{ duration: 0.6 }}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur rounded-full px-2.5 py-1 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white" style={{ fontSize: "0.65rem", fontWeight: 600 }}>
                    {LISTINGS[activeApt].available} phòng trống
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex gap-1">
                  {LISTINGS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveApt(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeApt ? "bg-white w-4" : "bg-white/40 w-1.5"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-bold" style={{ fontSize: "1rem" }}>
                      {LISTINGS[activeApt].name}
                    </h3>
                    <p className="text-white/45 flex items-center gap-1 mt-0.5" style={{ fontSize: "0.77rem" }}>
                      <MapPin size={11} />{LISTINGS[activeApt].district}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-bold" style={{ fontSize: "1rem" }}>
                      {LISTINGS[activeApt].priceFrom}M
                    </p>
                    <p className="text-white/35" style={{ fontSize: "0.68rem" }}>/tháng</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400" style={{ fill: "#facc15" }} />
                    <span className="text-white/60" style={{ fontSize: "0.75rem" }}>{LISTINGS[activeApt].rating}</span>
                  </div>
                  <span className="text-white/20">·</span>
                  <span className="text-white/40" style={{ fontSize: "0.75rem" }}>{LISTINGS[activeApt].area}</span>
                  <div className="flex gap-1.5 ml-auto">
                    {LISTINGS[activeApt].amenities.map((a) => (
                      <span key={a} className="bg-white/8 text-white/50 px-2 py-0.5 rounded" style={{ fontSize: "0.6rem" }}>{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat cards */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -left-8 bottom-20 rounded-xl border border-emerald-500/20 px-4 py-3 shadow-xl"
              style={{ background: "rgba(16,185,129,0.12)", backdropFilter: "blur(12px)" }}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp size={16} className="text-emerald-400" />
                <div>
                  <p className="text-white font-bold" style={{ fontSize: "0.9rem" }}>45.2M ₫</p>
                  <p className="text-emerald-400/80" style={{ fontSize: "0.62rem" }}>Doanh thu tháng</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-6 bottom-36 rounded-xl border border-violet-500/20 px-4 py-3 shadow-xl"
              style={{ background: "rgba(139,92,246,0.12)", backdropFilter: "blur(12px)" }}
            >
              <div className="flex items-center gap-2.5">
                <Bell size={16} className="text-violet-400" />
                <div>
                  <p className="text-white font-bold" style={{ fontSize: "0.9rem" }}>Đã thu tiền</p>
                  <p className="text-violet-400/80" style={{ fontSize: "0.62rem" }}>Phòng 805 · 12M ₫</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 1 }}
              className="absolute right-4 bottom-8 rounded-xl border border-cyan-500/20 px-3.5 py-2.5 shadow-xl"
              style={{ background: "rgba(6,182,212,0.1)", backdropFilter: "blur(12px)" }}
            >
              <div className="flex items-center gap-2">
                <Bot size={14} className="text-cyan-400" />
                <p className="text-white/70" style={{ fontSize: "0.72rem" }}>
                  AI đang tư vấn <span className="text-cyan-400 font-semibold">24</span> khách
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/20"
          style={{ fontSize: "0.63rem" }}
        >
          <span>Cuộn xuống</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────── */}
      <section
        className="py-10 border-y border-white/5"
        style={{ background: "var(--nv-surface-alt)" }}
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.color}18` }}
              >
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-white font-extrabold" style={{ fontSize: "1.3rem", letterSpacing: "-0.03em" }}>
                  {s.value}
                </p>
                <p className="text-white/40" style={{ fontSize: "0.72rem" }}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-cyan-400 mb-3" style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em" }}>
              QUY TRÌNH 3 BƯỚC
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.03em" }} className="text-white">
              Đơn giản từ đầu đến cuối
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.12 }}
                className="relative rounded-2xl p-6 border border-white/6 group hover:border-white/12 transition-all"
                style={{ background: "var(--nv-surface)" }}
              >
                <span
                  className="absolute top-5 right-5 font-black"
                  style={{ fontSize: "3rem", lineHeight: 1, color: `${h.color}10`, letterSpacing: "-0.05em" }}
                >
                  {h.step}
                </span>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${h.color}18` }}
                >
                  <h.icon size={20} style={{ color: h.color }} />
                </div>
                <h3 className="text-white mb-2" style={{ fontSize: "1.05rem", fontWeight: 700 }}>{h.title}</h3>
                <p className="text-white/45" style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ───────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5" style={{ background: "var(--nv-surface-alt)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/18 rounded-full px-3 py-1 mb-3">
                <Home size={12} className="text-emerald-400" />
                <span className="text-emerald-400" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em" }}>
                  DÀNH CHO KHÁCH THUÊ
                </span>
              </div>
              <h2 className="text-white" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
                Căn hộ đang còn phòng trống
              </h2>
              <p className="text-white/40 mt-1" style={{ fontSize: "0.88rem" }}>
                Kiểm duyệt & xác thực bởi AI — cập nhật thời gian thực
              </p>
            </div>
            <button
              onClick={() => navigate("/tenant")}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              Xem tất cả<ArrowRight size={15} />
            </button>
          </motion.div>

          {/* Hint */}
          <div className="flex items-center gap-2 mb-4 text-white/30" style={{ fontSize: "0.72rem" }}>
            <ChevronRight size={13} className="rotate-90 opacity-50" />
            Vuốt sang phải để xem thêm {LISTINGS.length - 4} căn hộ
          </div>

          <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            <div className="flex gap-4" style={{ minWidth: "max-content" }}>
              {LISTINGS.map((apt, i) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: Math.min(i, 3) * 0.08 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => navigate("/tenant")}
                  className="rounded-3xl overflow-hidden cursor-pointer group flex-shrink-0 relative"
                  style={{
                    width: "260px",
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",
                    transition: "box-shadow 0.3s, border-color 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px ${apt.badgeHex}44, inset 0 1px 0 rgba(255,255,255,0.1)`;
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${apt.badgeHex}44`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.09)";
                  }}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={apt.img}
                      alt={apt.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <span
                      className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-white"
                      style={{ fontSize: "0.6rem", fontWeight: 700, background: apt.badgeHex, boxShadow: `0 0 8px ${apt.badgeHex}80` }}
                    >
                      {apt.badge}
                    </span>
                    <div className="absolute top-3 right-3 rounded-full px-2.5 py-0.5 flex items-center gap-1.5"
                      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-white" style={{ fontSize: "0.6rem", fontWeight: 600 }}>{apt.available} trống</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold" style={{ fontSize: "0.88rem", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{apt.name}</h3>
                      <p className="text-white/65 flex items-center gap-1" style={{ fontSize: "0.7rem" }}>
                        <MapPin size={9} />{apt.district}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-cyan-400 font-bold" style={{ fontSize: "1rem" }}>{apt.priceFrom}M</span>
                      <span className="text-white/25 text-xs">–</span>
                      <span className="text-cyan-400 font-bold" style={{ fontSize: "1rem" }}>{apt.priceTo}M</span>
                      <span className="text-white/35" style={{ fontSize: "0.68rem" }}>/tháng</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {apt.amenities.map((a) => (
                        <span key={a} className="text-white/55 px-2 py-0.5 rounded-md"
                          style={{ fontSize: "0.6rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}>{a}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-yellow-400" style={{ fill: "#facc15" }} />
                        <span className="text-white/55" style={{ fontSize: "0.72rem" }}>{apt.rating}</span>
                      </div>
                      <span className="text-white/30" style={{ fontSize: "0.68rem" }}>{apt.area}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <button
              onClick={() => navigate("/tenant/register")}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
              style={{
                fontSize: "0.9rem",
                background: "linear-gradient(135deg, #34d399, #22d3ee)",
                boxShadow: "0 0 24px rgba(52,211,153,0.2)",
              }}
            >
              Đăng ký vào hệ thống 
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/tenant")}
              className="flex items-center gap-1.5 text-white/45 hover:text-white/70 transition-colors"
              style={{ fontSize: "0.875rem" }}
            >
              Duyệt tất cả căn hộ<ChevronRight size={14} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── AI CONTROL ROOM ─────────────────────────────────────── */}
      <section className="py-24 px-6">
        <AgentControlRoom />
      </section>

      {/* ── WEB SECURITY ────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5" style={{ background: "var(--nv-surface-alt)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-red-500/8 border border-red-500/18 rounded-full px-4 py-1.5 mb-4">
              <Shield size={13} className="text-red-400" />
              <span className="text-red-400" style={{ fontSize: "0.73rem", fontWeight: 700, letterSpacing: "0.08em" }}>
                WEB SECURITY
              </span>
            </div>
            <h2 className="text-white mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Bảo mật cấp doanh nghiệp
            </h2>
            <p className="text-white/40 max-w-xl mx-auto" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
              Hệ thống được kiểm thử xâm nhập định kỳ, tuân thủ OWASP Top 10 và các tiêu chuẩn
              bảo mật quốc tế. Dữ liệu người dùng được bảo vệ đa lớp từ network đến database.
            </p>
          </motion.div>

          {/* Security feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {SECURITY_FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                className="rounded-2xl p-5 border border-white/6 hover:border-white/12 transition-all group"
                style={{ background: "var(--nv-surface)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${f.color}18` }}
                  >
                    <f.icon size={20} style={{ color: f.color }} />
                  </div>
                  <span
                    className="px-2.5 py-0.5 rounded-full font-semibold"
                    style={{ fontSize: "0.62rem", background: `${f.color}20`, color: f.color }}
                  >
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-white mb-1.5" style={{ fontSize: "0.95rem", fontWeight: 700 }}>{f.title}</h3>
                <p className="text-white/40" style={{ fontSize: "0.8rem", lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* OWASP Top 10 compliance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6 border border-white/6"
            style={{ background: "var(--nv-surface)" }}
          >
            <div className="flex items-start md:items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="text-white font-bold mb-0.5" style={{ fontSize: "1rem" }}>
                  OWASP Top 10 — 2021 Compliance
                </p>
                <p className="text-white/40" style={{ fontSize: "0.8rem" }}>
                  Toàn bộ 10 lỗ hổng phổ biến nhất đều được xử lý, kiểm thử và vá định kỳ
                </p>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span className="text-emerald-400 font-semibold" style={{ fontSize: "0.78rem" }}>
                  10/10 Covered
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {OWASP_TOP10.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 border border-emerald-500/12 bg-emerald-500/5"
                >
                  <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-emerald-400 font-bold" style={{ fontSize: "0.62rem" }}>{item.id}</p>
                    <p className="text-white/40 leading-tight truncate" style={{ fontSize: "0.6rem" }}>{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── APP DOWNLOAD ────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-10 md:p-14 border border-white/6 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
            style={{ background: "var(--nv-surface)" }}
          >
            <div
              className="absolute -left-24 -top-12 w-60 h-60 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)" }}
            />
            <div
              className="absolute -right-24 -bottom-12 w-60 h-60 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)" }}
            />

            <div className="relative flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3 py-1 mb-4">
                <Smartphone size={12} className="text-cyan-400" />
                <span className="text-white/50" style={{ fontSize: "0.73rem", fontWeight: 500 }}>iOS & Android</span>
              </div>
              <h2 className="text-white mb-3" style={{ fontSize: "clamp(1.5rem,2.5vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
                Quản lý mọi thứ trong{" "}
                <span style={{ background: "linear-gradient(90deg, #22d3ee, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  lòng bàn tay
                </span>
              </h2>
              <p className="text-white/40 mb-7 max-w-md" style={{ fontSize: "0.9rem", lineHeight: 1.75 }}>
                Đồng bộ hoàn toàn giữa web và app — nhận thông báo thanh toán,
                theo dõi bảo trì và xem hợp đồng mọi lúc, mọi nơi
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {[
                  {
                    store: "App Store",
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                    ),
                  },
                  {
                    store: "Google Play",
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                        <path d="M3.18 23.4c.3.17.64.2.95.08l11.5-6.64-2.36-2.36L3.18 23.4zm15.14-8.74L5.69 7.91 3.18.6c-.3-.12-.64-.09-.95.08L13.23 11.7l5.09 2.96zm1.56-5.5L16.72 7.4l-2.93-1.7L2.23.57c-.43-.25-.95-.13-1.23.25v22.36c.28.38.8.5 1.23.25l11.55-6.67 2.93-1.7 3.16-1.83c.68-.4.68-1.4.01-1.79v.01z" fill="#34A853" />
                      </svg>
                    ),
                  },
                ].map(({ store, icon }) => (
                  <button
                    key={store}
                    className="flex items-center gap-3 rounded-xl px-5 py-3 border border-white/10 hover:border-white/20 transition-all"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <span className="text-white">{icon}</span>
                    <div className="text-left">
                      <p className="text-white/35" style={{ fontSize: "0.6rem" }}>Tải về trên</p>
                      <p className="text-white font-semibold" style={{ fontSize: "0.88rem" }}>{store}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Phone mockup */}
            <div className="relative flex-shrink-0">
              <div
                className="w-48 h-80 rounded-[2.5rem] border-2 border-white/10 shadow-2xl overflow-hidden"
                style={{ background: "linear-gradient(160deg, #111927 0%, #07101C 100%)" }}
              >
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-white/15" />
                <div className="absolute inset-0 pt-10 px-3">
                  <div className="h-3.5 w-3/4 rounded-md bg-white/8 mb-2" />
                  <div className="h-2.5 w-1/2 rounded-md bg-white/5 mb-4" />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {[["from-emerald-500 to-teal-500", "45.2M ₫"], ["from-violet-500 to-purple-500", "92%"]].map(([g, v], i) => (
                      <div key={i} className={`rounded-xl bg-gradient-to-br ${g} p-2.5`}>
                        <p className="text-white font-bold" style={{ fontSize: "0.75rem" }}>{v}</p>
                        <p className="text-white/55" style={{ fontSize: "0.5rem" }}>Live</p>
                      </div>
                    ))}
                  </div>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-7 rounded-lg bg-white/5 flex items-center px-2 gap-2 mb-1.5">
                      <div className="w-3.5 h-3.5 rounded bg-white/8 flex-shrink-0" />
                      <div className="flex-1 h-1.5 rounded bg-white/8" />
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full"
                style={{ background: "rgba(34,211,238,0.2)", filter: "blur(10px)" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LISTING BOARD ───────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
              <Bot size={13} className="text-violet-400" />
              <span className="text-violet-400" style={{ fontSize: "0.72rem", fontWeight: 700 }}>SÀN TÌM PHÒNG</span>
            </div>
            <h2 className="text-white mb-4" style={{ fontSize: "clamp(1.6rem,3.5vw,2.5rem)", fontWeight: 900, letterSpacing: "-0.03em" }}>
              Tin đăng{" "}
              <span style={{ background: "linear-gradient(90deg,#a78bfa,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                từ AI &amp; cộng đồng
              </span>
            </h2>
            <p className="text-white/45 max-w-xl mx-auto" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
              AI tự động đăng tin khi cư dân hủy hợp đồng. Quản lý và người dùng cũng có thể đăng tin tìm phòng.
            </p>
          </motion.div>

          {/* Static demo + dynamic listings */}
          {(() => {
            const dynamic: { id: string; title: string; price: string; area: string; district: string; description: string; type: string; postedAt: string }[] = (() => {
              try { return JSON.parse(localStorage.getItem("nv-listings-board") || "[]"); } catch { return []; }
            })();
            const staticListings = [
              { id: "S01", title: "Phòng 1801 — Vinhomes Grand Park", price: "9.5M/tháng", area: "58m²", district: "TP. Thủ Đức", description: "2PN · 1WC · Nội thất cơ bản. Cần cho thuê gấp, chủ nhà chuyển công tác. View thoáng, tầng cao.", type: "landlord", postedAt: "28/04/2025" },
              { id: "S02", title: "AI tìm phòng: 2PN Q7 dưới 12M", price: "11M/tháng", area: "65m²", district: "Quận 7", description: "Super Broker AI đang tìm phòng cho cư dân có nhu cầu. Pet-friendly, gần trường quốc tế. Kết nối ngay để nhận gợi ý!", type: "ai", postedAt: "29/04/2025" },
              { id: "S03", title: "Studio mới bàn giao — Masteri Centre Point", price: "10.2M/tháng", area: "45m²", district: "TP. Thủ Đức", description: "Căn studio full nội thất cao cấp, view hồ bơi. Phù hợp 1–2 người. Ký HĐ điện tử trực tiếp qua NestaVietAI.", type: "landlord", postedAt: "27/04/2025" },
              { id: "S04", title: "Tìm bạn ở ghép — Sunwah Pearl", price: "7M/người/tháng", area: "80m²", district: "Bình Thạnh", description: "Phòng 3PN cần thêm 1 người ở ghép. View sông Sài Gòn, đủ tiện nghi, chỉ cần 1 người nữa để chia phòng.", type: "user", postedAt: "26/04/2025" },
              { id: "S05", title: "Phòng vừa trả lại — Sunrise City North", price: "11.5M/tháng", area: "65m²", district: "Quận 7", description: "Phòng 1204 vừa hết hợp đồng. AI đã xác minh thông tin và đang tìm cư dân mới. 2PN · 2WC · Hồ bơi.", type: "ai", postedAt: "29/04/2025" },
            ];
            const all = [...dynamic, ...staticListings].slice(0, 6);
            const typeConfig: Record<string, { label: string; cls: string }> = {
              ai: { label: "🤖 AI Đăng", cls: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
              landlord: { label: "🏢 Quản lý", cls: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
              user: { label: "👤 Cư dân", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
            };
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
                {all.map((listing, i) => {
                  const tc = typeConfig[listing.type] || typeConfig.user;
                  return (
                    <motion.div key={listing.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                      whileHover={{ y: -4 }}
                      className="rounded-2xl p-5 cursor-pointer transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(167,139,250,0.3)"; (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.06)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${tc.cls}`} style={{ fontSize: "0.65rem" }}>{tc.label}</span>
                        <span className="text-white/30" style={{ fontSize: "0.65rem" }}>{listing.postedAt}</span>
                      </div>
                      <h3 className="text-white font-bold mb-2" style={{ fontSize: "0.92rem", lineHeight: 1.4 }}>{listing.title}</h3>
                      <p className="text-white/45 mb-4" style={{ fontSize: "0.78rem", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{listing.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-emerald-400 font-bold" style={{ fontSize: "0.95rem" }}>{listing.price}</p>
                          <p className="text-white/35" style={{ fontSize: "0.68rem" }}>{listing.area} · {listing.district}</p>
                        </div>
                        <button
                          onClick={() => navigate("/tenant/register")}
                          className="px-3 py-1.5 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                          style={{ fontSize: "0.72rem", background: "linear-gradient(135deg,#a78bfa,#22d3ee)" }}>
                          Liên hệ
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            );
          })()}

          <div className="text-center">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => setShowGetStarted(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-violet-500/30 text-violet-400 hover:text-white hover:border-violet-500 hover:bg-violet-500/10 transition-all"
              style={{ fontSize: "0.875rem", fontWeight: 600 }}>
              <Bot size={15} />Đăng tin tìm phòng với AI
              <ArrowRight size={14} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-white mb-4"
              style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-0.04em" }}
            >
              Bắt đầu ngay hôm nay
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg,#34d399,#22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                hoàn toàn miễn phí
              </span>
            </h2>
            <p className="text-white/40 mb-8 max-w-lg mx-auto" style={{ fontSize: "1rem", lineHeight: 1.7 }}>
              Hệ thống kết hợp với AI Super Broker để chuẩn hoá thông tin căn hộ nơi bạn ở.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(34,211,238,0.4)" }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowGetStarted(true)}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white"
                style={{
                  fontSize: "0.95rem",
                  background: "linear-gradient(135deg,#22d3ee,#3b82f6)",
                  boxShadow: "0 0 30px rgba(34,211,238,0.25)",
                }}
              >
                Bắt đầu ngay — miễn phí
                <ArrowRight size={17} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.3)" }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowGetStarted(true)}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white/65 border border-white/12 hover:text-white/85 transition-all"
                style={{ fontSize: "0.95rem" }}
              >
                <Building2 size={16} />
                Đăng ký quản lý tòa nhà
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 pt-14 pb-8 px-6" style={{ background: "var(--nv-surface-alt)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <Building2 size={14} className="text-white" />
                </div>
                <span style={{ fontSize: "1rem", fontWeight: 800 }}>
                  NestaViet<span className="text-cyan-400">AI</span>
                </span>
              </div>
              <p className="text-white/35 mb-5" style={{ fontSize: "0.82rem", lineHeight: 1.75, maxWidth: "260px" }}>
                Nền tảng PropTech thế hệ mới — hệ thống Multi-Agent AI tự trị cho thị trường bất động sản cho thuê Việt Nam.
              </p>
              <div className="space-y-1">
                <p className="text-emerald-500/50 font-mono" style={{ fontSize: "0.65rem" }}>tenant.nestaviet.vn</p>
                <p className="text-violet-500/50 font-mono" style={{ fontSize: "0.65rem" }}>manager.nestaviet.vn</p>
              </div>
            </div>
            {[
              { title: "Sản phẩm", links: [
                { label: "Tìm căn hộ",          href: "/tenant"     },
                { label: "AI Chatbot",            href: null          },
                { label: "Hợp đồng điện tử",     href: "/contracts"  },
                { label: "Thanh toán online",     href: "/payments"   },
                { label: "Báo cáo tài chính",     href: "/reports"    },
              ]},
              { title: "Công ty", links: [
                { label: "Về chúng tôi", href: null },
                { label: "Blog",          href: null },
                { label: "Tuyển dụng",   href: null },
                { label: "Đối tác",      href: null },
              ]},
              { title: "Hỗ trợ", links: [
                { label: "Trợ giúp",   href: null       },
                { label: "Liên hệ",   href: null        },
                { label: "Chính sách",href: null        },
                { label: "Bảo mật",   href: "/security" },
              ]},
            ].map((col) => (
              <div key={col.title}>
                <p className="text-white/70 mb-4" style={{ fontSize: "0.85rem", fontWeight: 700 }}>{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(({ label, href }) => (
                    <li key={label}>
                      <button onClick={() => href && navigate(href)} className="text-white/35 hover:text-white/65 transition-colors" style={{ fontSize: "0.8rem" }}>
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="text-white/22" style={{ fontSize: "0.72rem" }}>
              NestaVietAI © 2026 — Bản quyền được bảo lưu
            </span>
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate("/landlord/register")}
                className="text-white/18 hover:text-white/40 transition-colors"
                style={{ fontSize: "0.7rem" }}
              >
                Bạn là chủ nhà / quản lý tòa nhà? →
              </button>
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border border-white/5"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/28" style={{ fontSize: "0.67rem" }}>Hệ thống hoạt động bình thường</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <ChatWidget trigger={chatTrigger} />
    </div>
  );
}
