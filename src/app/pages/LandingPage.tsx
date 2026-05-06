import { useState, useEffect, useRef, CSSProperties } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "motion/react";
import {
  Building2, Star, Shield, Zap, Bot,
  MessageSquare, CheckCircle2, ArrowRight,
  Search, MapPin, Home,
  FileText, Play,
  Lock, Eye, Key, Database, Activity,
  X, UserPlus, LogIn, Globe, ChevronRight,
  BarChart3, Smartphone, QrCode, Sliders, TrendingUp,
} from "lucide-react";
import { ChatWidget } from "../components/ChatWidget";
import { useLang } from "../../hooks/useLang";
import { useCountUp } from "../../hooks/useCountUp";

// ─── Images ──────────────────────────────────────────────────────────────────
const IMG_APT_1 = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=75&fit=crop";
const IMG_APT_2 = "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=75&fit=crop";
const IMG_APT_3 = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=75&fit=crop";
const IMG_APT_4 = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=75&fit=crop";
const IMG_APT_5 = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=75&fit=crop";
const IMG_APT_6 = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=75&fit=crop";
const IMG_APT_7 = "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&q=75&fit=crop";
const IMG_APT_8 = "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&q=75&fit=crop";

const LISTINGS = [
  { id: 1, img: IMG_APT_1, name: "Vinhomes Grand Park",   district: "TP. Thủ Đức",  priceFrom: 8.5, priceTo: 15, available: 4, area: "45–85 m²",   rating: 4.9, badge: "Mới nhất",      badgeHex: "#10b981", amenities: ["Hồ bơi","Gym","Bãi xe"] },
  { id: 2, img: IMG_APT_2, name: "Masteri Centre Point",  district: "TP. Thủ Đức",  priceFrom: 12,  priceTo: 22, available: 2, area: "60–120 m²",  rating: 4.8, badge: "Cao cấp",       badgeHex: "#8b5cf6", amenities: ["Sky Bar","Hồ bơi","Concierge"] },
  { id: 3, img: IMG_APT_3, name: "The Estella Heights",   district: "TP.HCM",        priceFrom: 18,  priceTo: 35, available: 1, area: "85–150 m²",  rating: 4.7, badge: "Sang trọng",   badgeHex: "#f59e0b", amenities: ["Concierge","Gym","Spa"] },
  { id: 4, img: IMG_APT_4, name: "Eco Green Saigon",      district: "TP.HCM",        priceFrom: 7,   priceTo: 13, available: 6, area: "40–75 m²",   rating: 4.6, badge: "Còn nhiều",    badgeHex: "#06b6d4", amenities: ["Cây xanh","Gym","Bãi xe"] },
  { id: 5, img: IMG_APT_5, name: "Sunwah Pearl",          district: "Bình Thạnh",    priceFrom: 14,  priceTo: 28, available: 3, area: "60–110 m²",  rating: 4.8, badge: "Hot Deal",     badgeHex: "#ef4444", amenities: ["Sky Pool","Gym","Business Ctr"] },
  { id: 6, img: IMG_APT_6, name: "Gateway Thảo Điền",    district: "TP. Thủ Đức",   priceFrom: 11,  priceTo: 20, available: 5, area: "50–95 m²",   rating: 4.6, badge: "View sông",   badgeHex: "#3b82f6", amenities: ["Hồ bơi","Gym","Bãi xe"] },
  { id: 7, img: IMG_APT_7, name: "Riviera Point",         district: "Quận 7",        priceFrom: 15,  priceTo: 30, available: 2, area: "70–130 m²",  rating: 4.7, badge: "Cao cấp",     badgeHex: "#8b5cf6", amenities: ["Hồ bơi","Concierge","Spa"] },
  { id: 8, img: IMG_APT_8, name: "Botanica Premier",      district: "Tân Bình",      priceFrom: 9,   priceTo: 17, available: 7, area: "45–80 m²",   rating: 4.5, badge: "Còn nhiều",   badgeHex: "#06b6d4", amenities: ["Cây xanh","Hồ bơi","Gym"] },
];

const AGENTS = [
  { id: 1, name: "Listing Verifier", icon: Shield,      g: "from-blue-500 to-cyan-400",    desc: "Kiểm duyệt NLP + Vision AI, sinh SEO copy tự động" },
  { id: 2, name: "Super Broker",     icon: MessageSquare,g: "from-emerald-500 to-teal-400", desc: "Tư vấn conversational search 24/7, RAG + chốt lịch hẹn" },
  { id: 3, name: "Smart Concierge", icon: Zap,          g: "from-violet-500 to-purple-400",desc: "Triage sự cố, dispatch kỹ thuật, theo dõi SLA" },
  { id: 4, name: "Contract & Admin",icon: BarChart3,    g: "from-orange-500 to-amber-400", desc: "Hóa đơn VietQR, reconcile thanh toán, báo cáo dòng tiền" },
];
const AGENT_COLORS   = ["#3b82f6","#10b981","#8b5cf6","#f59e0b"];
const AGENT_METRICS  = [
  { val: "234",   label: "Listings duyệt hôm nay", sub: "12 bị từ chối tự động" },
  { val: "1,204", label: "Phiên tư vấn AI",        sub: "Avg. reply: 1.2s" },
  { val: "89",    label: "Tickets xử lý",          sub: "SLA đạt: 97.8%" },
  { val: "156",   label: "Hóa đơn xuất",           sub: "0 sai sót tính toán" },
];
const AGENT_LOGS = [
  { agent: "Listing Verifier", msg: "Duyệt xong #L-2204 — NLP OK, 4/4 ảnh đạt chuẩn → Đã đăng lên sàn",              color: "#3b82f6" },
  { agent: "Super Broker",     msg: "Tư vấn khách 2PN Q7 <12M — RAG gợi ý 3 lựa chọn, chốt lịch hẹn Thứ 7",           color: "#10b981" },
  { agent: "Smart Concierge", msg: "Ticket T-089: Điều hoà hỏng T8 — Gán kỹ thuật viên Minh, SLA còn 2h45p",           color: "#8b5cf6" },
  { agent: "Contract Agent",  msg: "Xuất 156 hóa đơn T5 — VietQR đính kèm, gửi email xong 100%",                      color: "#f59e0b" },
  { agent: "Listing Verifier", msg: "Phát hiện watermark #IMG-0392 — Từ chối tự động, yêu cầu chủ nhà chụp lại",       color: "#3b82f6" },
  { agent: "Super Broker",     msg: "Khách VIP hỏi 3PN Thảo Điền — Kết nối chủ nhà, tour ảo 8h sáng mai",              color: "#10b981" },
  { agent: "Smart Concierge", msg: "Ticket T-090 đóng — Xử lý trong 2h47p, cư dân đánh giá 5⭐",                       color: "#8b5cf6" },
  { agent: "Contract Agent",  msg: "Webhook: P.1204 thanh toán 11.5M ₫ — Gạch nợ & gửi biên nhận tự động",             color: "#f59e0b" },
];

const SECURITY_FEATURES = [
  { icon: Lock,     title: "TLS 1.3 & HTTPS",        desc: "Toàn bộ dữ liệu mã hóa end-to-end. A+ SSL Rating.",                  color: "#ef4444", tag: "A+ Rating"  },
  { icon: Shield,   title: "OWASP Top 10",            desc: "Phòng chống SQLi, XSS, CSRF, IDOR theo chuẩn OWASP 2021.",            color: "#f97316", tag: "Compliant"  },
  { icon: Eye,      title: "WAF & DDoS Protection",  desc: "Web Application Firewall, rate limiting & bot mitigation tự động.",   color: "#eab308", tag: "Always-on"  },
  { icon: Key,      title: "Zero-Trust Auth",         desc: "JWT + rotating refresh token, bcrypt, brute-force lockout.",          color: "#22d3ee", tag: "Secure"     },
  { icon: Database, title: "Encryption at Rest",     desc: "AES-256 mã hóa dữ liệu nhạy cảm tại tầng DB — CCCD, hợp đồng.",    color: "#a78bfa", tag: "AES-256"    },
  { icon: Activity, title: "SIEM Monitoring 24/7",   desc: "Giám sát real-time, anomaly detection, cảnh báo tức thì.",            color: "#34d399", tag: "24/7"       },
];

const MARQUEE_ITEMS = [
  { text: "12,400+ Căn hộ xác thực", dot: "#22d3ee" },
  { text: "4.9 ★ App Store",          dot: "#fbbf24" },
  { text: "AI Agents 24/7",            dot: "#a78bfa" },
  { text: "98% Khách hài lòng",        dot: "#34d399" },
  { text: "3,200+ Giao dịch / tháng", dot: "#22d3ee" },
  { text: "4.8 ★ Google Play",         dot: "#fbbf24" },
  { text: "TLS 1.3 Bảo mật",          dot: "#ef4444" },
  { text: "VietQR Tích hợp",          dot: "#10b981" },
  { text: "Hợp đồng điện tử",         dot: "#8b5cf6" },
  { text: "Phản hồi trong 1.2s",      dot: "#22d3ee" },
];

// ─── Vietnam 34-province heatmap data (định danh mới từ 01/07/2025) ──────────
// Sáp nhập: Bắc Giang→Bắc Ninh, Hải Dương→Hưng Yên, Vĩnh Phúc→Phú Thọ,
// Bắc Kạn→Thái Nguyên, Hà Giang→Tuyên Quang, Yên Bái→Lào Cai, Sơn La→Điện Biên,
// Hòa Bình+Hà Nam+Nam Định→Ninh Bình, Quảng Bình→Hà Tĩnh, Quảng Trị→Huế,
// Phú Yên→Bình Định, Ninh Thuận→Khánh Hòa, Đắk Nông→Đắk Lắk, Kon Tum→Gia Lai,
// Bình Thuận→Lâm Đồng, Bình Phước+Tây Ninh→Bình Dương, Bà Rịa-VT→Đồng Nai,
// Tiền Giang+Bến Tre→Long An, Hậu Giang+Sóc Trăng→Cần Thơ, Kiên Giang→An Giang,
// Vĩnh Long+Trà Vinh→Đồng Tháp, Bạc Liêu→Cà Mau
type ProvinceEntry = { id: string; name: string; avg: number; sub: string; wards?: number };
const VIETNAM_PROVINCES: Record<"north" | "central" | "south", ProvinceEntry[]> = {
  north: [
    { id: "ha-noi",      name: "Hà Nội",      avg: 15, sub: "TP. Trực thuộc TW",          wards: 126 },
    { id: "hai-phong",   name: "Hải Phòng",   avg: 8,  sub: "TP. Trực thuộc TW",          wards: 114 },
    { id: "quang-ninh",  name: "Quảng Ninh",  avg: 7,  sub: "Tỉnh",                       wards: 54  },
    { id: "bac-ninh",    name: "Bắc Ninh",    avg: 6,  sub: "Tỉnh (+ Bắc Giang)",         wards: 99  },
    { id: "hung-yen",    name: "Hưng Yên",    avg: 5,  sub: "Tỉnh (+ Hải Dương)",         wards: 104 },
    { id: "phu-tho",     name: "Phú Thọ",     avg: 5,  sub: "Tỉnh (+ Vĩnh Phúc)",        wards: 148 },
    { id: "thai-nguyen", name: "Thái Nguyên", avg: 5,  sub: "Tỉnh (+ Bắc Kạn)",          wards: 92  },
    { id: "tuyen-quang", name: "Tuyên Quang", avg: 4,  sub: "Tỉnh (+ Hà Giang)",          wards: 124 },
    { id: "cao-bang",    name: "Cao Bằng",    avg: 3,  sub: "Tỉnh",                       wards: 56  },
    { id: "lang-son",    name: "Lạng Sơn",    avg: 4,  sub: "Tỉnh",                       wards: 65  },
    { id: "lao-cai",     name: "Lào Cai",     avg: 5,  sub: "Tỉnh (+ Yên Bái)",           wards: 99  },
    { id: "lai-chau",    name: "Lai Châu",    avg: 3,  sub: "Tỉnh",                       wards: 38  },
    { id: "dien-bien",   name: "Điện Biên",   avg: 3,  sub: "Tỉnh (+ Sơn La)",            wards: 45  },
    { id: "ninh-binh",   name: "Ninh Bình",   avg: 5,  sub: "Tỉnh (+ Hà Nam + Nam Định)", wards: 129 },
    { id: "thanh-hoa",   name: "Thanh Hóa",   avg: 5,  sub: "Tỉnh",                       wards: 166 },
    { id: "nghe-an",     name: "Nghệ An",     avg: 5,  sub: "Tỉnh",                       wards: 130 },
    { id: "ha-tinh",     name: "Hà Tĩnh",     avg: 4,  sub: "Tỉnh (+ Quảng Bình)",        wards: 69  },
  ],
  central: [
    { id: "hue",        name: "Huế",        avg: 6,  sub: "Tỉnh (+ Quảng Trị)",   wards: 40  },
    { id: "da-nang",    name: "Đà Nẵng",    avg: 10, sub: "TP. Trực thuộc TW",    wards: 94  },
    { id: "quang-nam",  name: "Quảng Nam",  avg: 4,  sub: "Tỉnh",                 wards: 96  },
    { id: "quang-ngai", name: "Quảng Ngãi", avg: 4,  sub: "Tỉnh",                 wards: 96  },
    { id: "binh-dinh",  name: "Bình Định",  avg: 5,  sub: "Tỉnh (+ Phú Yên)",     wards: 88  },
    { id: "khanh-hoa",  name: "Khánh Hòa",  avg: 7,  sub: "Tỉnh (+ Ninh Thuận)",  wards: 65  },
    { id: "dak-lak",    name: "Đắk Lắk",   avg: 5,  sub: "Tỉnh (+ Đắk Nông)",   wards: 102 },
    { id: "gia-lai",    name: "Gia Lai",    avg: 4,  sub: "Tỉnh (+ Kon Tum)",     wards: 135 },
    { id: "lam-dong",   name: "Lâm Đồng",   avg: 6,  sub: "Tỉnh (+ Bình Thuận)", wards: 124 },
  ],
  south: [
    { id: "hcm",        name: "Hồ Chí Minh", avg: 16, sub: "TP. Trực thuộc TW",                    wards: 168 },
    { id: "binh-duong", name: "Bình Dương",   avg: 7,  sub: "Tỉnh (+ Bình Phước + Tây Ninh)",       wards: 96  },
    { id: "dong-nai",   name: "Đồng Nai",     avg: 7,  sub: "Tỉnh (+ Bà Rịa-VT)",                  wards: 95  },
    { id: "long-an",    name: "Long An",      avg: 5,  sub: "Tỉnh (+ Tiền Giang + Bến Tre)",        wards: 108 },
    { id: "can-tho",    name: "Cần Thơ",      avg: 6,  sub: "TP. Trực thuộc TW (+ Hậu Giang + Sóc Trăng)", wards: 103 },
    { id: "an-giang",   name: "An Giang",     avg: 4,  sub: "Tỉnh (+ Kiên Giang)",                  wards: 102 },
    { id: "dong-thap",  name: "Đồng Tháp",   avg: 4,  sub: "Tỉnh (+ Vĩnh Long + Trà Vinh)",        wards: 102 },
    { id: "ca-mau",     name: "Cà Mau",      avg: 4,  sub: "Tỉnh (+ Bạc Liêu)",                    wards: 64  },
  ],
};

// ─── Market insights articles ─────────────────────────────────────────────────
const MARKET_ARTICLES = [
  {
    category: "Market Report",
    title: "Thị trường cho thuê Q1/2025: Nhu cầu tăng 18% so với cùng kỳ",
    excerpt: "Phân khúc 10–15M/tháng tiếp tục dẫn đầu với tỷ lệ lấp đầy 94%. TP. Thủ Đức và Bình Thạnh ghi nhận mức tăng cao nhất.",
    readTime: "4 phút đọc",
    date: "28/04/2025",
    tag: "#market",
    color: "#22d3ee",
  },
  {
    category: "AI & PropTech",
    title: "AI thay đổi cách tìm kiếm bất động sản cho thuê tại Việt Nam",
    excerpt: "Multi-Agent AI rút ngắn thời gian tìm phòng từ 2 tuần xuống 2 ngày. Tỷ lệ khớp chính xác đạt 89% theo khảo sát NPS.",
    readTime: "6 phút đọc",
    date: "24/04/2025",
    tag: "#AI",
    color: "#a78bfa",
  },
  {
    category: "Legal Update",
    title: "Hợp đồng điện tử có giá trị pháp lý đầy đủ từ 01/07/2025",
    excerpt: "Bộ Tư pháp xác nhận hợp đồng thuê nhà ký số tương đương bản giấy, tạo nền tảng cho PropTech phát triển mạnh.",
    readTime: "3 phút đọc",
    date: "20/04/2025",
    tag: "#legal",
    color: "#34d399",
  },
];

const DISTRICTS_FILTER = ["Tất cả quận", "TP. Thủ Đức", "Quận 7", "Bình Thạnh", "Tân Bình", "Quận 1", "Quận 3"];

const TOUR_STEPS = [
  { title: "Tìm kiếm bằng AI", desc: "Nhắn tin tự nhiên — AI Super Broker hiểu ngữ cảnh và lọc căn hộ phù hợp trong giây lát.", icon: Search },
  { title: "4 AI Agents · 24/7", desc: "Mỗi agent chuyên một nghiệp vụ: duyệt tin, tư vấn, quản lý sự cố, xuất hóa đơn.", icon: Bot },
  { title: "Căn hộ đã xác thực", desc: "Listing Verifier AI kiểm tra hình ảnh, giá và thông tin trước khi đăng lên sàn.", icon: Shield },
  { title: "Đăng ký miễn phí", desc: "Không cần thẻ tín dụng. Trải nghiệm đầy đủ tính năng PropTech ngay hôm nay.", icon: ArrowRight },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const bentoContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const bentoCardVariants = {
  hidden:   { opacity: 0, y: 60, scale: 0.94 },
  visible:  { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 20 } },
};
const bentoAICardVariants = {
  hidden:   { opacity: 0, x: -30, y: 40, scale: 0.94 },
  visible:  { opacity: 1, x: 0, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 20 } },
};
const securityContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } },
};
const securityCardVariants = {
  hidden:   { opacity: 0, y: 32, scale: 0.95 },
  visible:  { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 130, damping: 22 } },
};

// ─── StatCounter — animates only when in view ─────────────────────────────
function StatCounter({ target, suffix = "", prefix = "", color, label, duration = 1200 }: {
  target: number; suffix?: string; prefix?: string; color: string; label: string; duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCountUp(inView ? target : 0, duration);
  return (
    <div ref={ref}>
      <p className="font-black" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", letterSpacing: "-0.04em", color }}>
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className="text-white/38" style={{ fontSize: "0.75rem" }}>{label}</p>
      <div className="mt-2 h-px rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
      </div>
    </div>
  );
}

// ─── HeroLiveWidget — floating activity card for hero section ─────────────
function HeroLiveWidget() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const events = [
    { msg: "AI duyệt #L-2204 — ảnh OK", color: "#3b82f6", time: "08:42" },
    { msg: "Cư dân P.805 thanh toán 12M", color: "#10b981", time: "08:39" },
    { msg: "Super Broker chốt lịch hẹn", color: "#a78bfa", time: "08:35" },
    { msg: "HĐ ký điện tử #C-0301 xong",  color: "#f59e0b", time: "08:31" },
    { msg: "Ticket T-089 đóng · 5⭐",      color: "#8b5cf6", time: "08:28" },
  ];
  const currentEvents = Array.from({ length: 4 }, (_, i) => events[(tick + i) % events.length]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 0.55, type: "spring", stiffness: 180, damping: 22 }}
      className="hidden xl:block absolute right-[-1rem] top-1/2 -translate-y-1/2 w-72"
      style={{ zIndex: 5 }}
    >
      <div className="rounded-2xl border border-white/10 overflow-hidden"
        style={{ background: "rgba(5,10,24,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 24px 72px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,211,238,0.08)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/7" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/45 font-mono" style={{ fontSize: "0.65rem", fontWeight: 600 }}>LIVE ACTIVITY</span>
          </div>
          <span className="text-white/22 font-mono" style={{ fontSize: "0.6rem" }}>NestaVietAI</span>
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-white/6 px-0 py-0">
          {[
            { val: "24",   label: "AI tư vấn", color: "#22d3ee" },
            { val: "4",    label: "Agents ON",  color: "#a78bfa" },
            { val: "97.8%",label: "SLA",        color: "#34d399" },
          ].map(({ val, label, color }) => (
            <div key={label} className="flex flex-col items-center py-3">
              <p className="font-bold" style={{ fontSize: "0.95rem", color }}>{val}</p>
              <p className="text-white/28" style={{ fontSize: "0.58rem" }}>{label}</p>
            </div>
          ))}
        </div>
        {/* Event stream */}
        <div className="px-4 py-3 space-y-2">
          {currentEvents.map((e, i) => (
            <motion.div key={`${tick}-${i}`}
              initial={i === 0 ? { opacity: 0, y: -8 } : { opacity: 1 - i * 0.2 }}
              animate={{ opacity: 1 - i * 0.2 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
              <span className="text-white/45 flex-1 truncate" style={{ fontSize: "0.68rem" }}>{e.msg}</span>
              <span className="text-white/18 flex-shrink-0 font-mono" style={{ fontSize: "0.6rem" }}>{e.time}</span>
            </motion.div>
          ))}
        </div>
        {/* Bottom bar */}
        <div className="px-4 py-2.5 border-t border-white/6" style={{ background: "rgba(0,0,0,0.2)" }}>
          <div className="flex items-center justify-between">
            <span className="text-white/28" style={{ fontSize: "0.62rem" }}>3,200+ giao dịch/tháng</span>
            <span className="text-emerald-400/60" style={{ fontSize: "0.6rem", fontWeight: 600 }}>↑ 12%</span>
          </div>
        </div>
      </div>
      {/* Floating ambient glow */}
      <div className="absolute -inset-4 rounded-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)", filter: "blur(20px)" }} />
    </motion.div>
  );
}

// ─── BentoAICard — animated live agent dashboard in the features grid ────────
function BentoAICard({ t }: { t: (vi: string, en: string) => string }) {
  const [procIdx, setProcIdx] = useState(0);
  const [logTick, setLogTick] = useState(0);
  useEffect(() => {
    const a = setInterval(() => setProcIdx(i => (i + 1) % 4), 2400);
    const b = setInterval(() => setLogTick(i => i + 1), 1600);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  const miniLogs = [
    { col: "#3b82f6", msg: "#L-2204 duyệt xong · 4/4 ảnh OK" },
    { col: "#10b981", msg: "Khách 2PN Q7 — chốt lịch hẹn" },
    { col: "#8b5cf6", msg: "T-089 điều hoà hỏng — SLA 2h45p" },
    { col: "#f59e0b", msg: "156 hóa đơn xuất · VietQR OK" },
    { col: "#3b82f6", msg: "Watermark #IMG-0392 từ chối" },
    { col: "#10b981", msg: "3PN Thảo Điền — tour ảo 8h mai" },
  ];
  const visibleLog = miniLogs[(logTick) % miniLogs.length];

  return (
    <motion.div variants={bentoAICardVariants}
      className="col-span-12 lg:col-span-7 rounded-3xl relative overflow-hidden group cursor-pointer"
      style={{ background: "rgba(3,7,18,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}
      whileHover={{ borderColor: "rgba(34,211,238,0.25)" }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 15% 20%, rgba(34,211,238,0.08) 0%, transparent 55%)" }} />

      {/* Header area */}
      <div className="relative z-10 p-7 pb-4">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/18 rounded-full px-3 py-1 mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em" }}>MULTI-AGENT AI · LIVE</span>
        </div>
        <h3 className="text-white mb-2" style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
          {t("4 AI Agents hoạt động 24/7","4 AI Agents running 24/7")}
        </h3>
        <p className="text-white/38" style={{ fontSize: "0.88rem", lineHeight: 1.65, maxWidth: "420px" }}>
          {t("Kiến trúc đa tác nhân tự trị — mỗi agent chuyên một nghiệp vụ, chạy song song liên tục.","Autonomous multi-agent architecture — each agent specialises, runs continuously in parallel.")}
        </p>
      </div>

      {/* Agent status grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-0 border-t border-b border-white/5 divide-x divide-white/5 mx-0">
        {AGENTS.map((a, i) => {
          const isActive = procIdx === i;
          const col = AGENT_COLORS[i];
          return (
            <div key={a.id} className="px-4 py-4 transition-colors duration-500 relative"
              style={{ background: isActive ? `${col}08` : "transparent" }}>
              {isActive && <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${col}12 0%, transparent 65%)` }} />}
              <div className="relative">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.g} flex items-center justify-center mb-2.5 transition-all duration-500`}
                  style={{ boxShadow: isActive ? `0 0 20px ${col}45` : "none" }}>
                  <a.icon size={16} className="text-white" />
                </div>
                <p className="text-white font-semibold" style={{ fontSize: "0.72rem", lineHeight: 1.3 }}>{a.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <motion.div className="w-1 h-1 rounded-full" style={{ background: isActive ? col : "#34d399" }}
                    animate={isActive ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 0.7 }} />
                  <span style={{ fontSize: "0.55rem", color: isActive ? col : "#34d399", fontWeight: 700, opacity: 0.75 }}>
                    {isActive ? "PROC..." : "ONLINE"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live log ticker */}
      <div className="relative z-10 flex items-center gap-3 px-7 py-3">
        <Activity size={11} className="text-white/20 flex-shrink-0" />
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={logTick}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5">
              <span className="font-bold font-mono flex-shrink-0" style={{ color: visibleLog.col, fontSize: "0.62rem" }}>
                [{AGENTS[logTick % 4].name.split(" ").slice(0,2).join(" ")}]
              </span>
              <span className="text-white/30 truncate" style={{ fontSize: "0.65rem" }}>{visibleLog.msg}</span>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400/40 font-mono" style={{ fontSize: "0.58rem" }}>streaming</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── GetStartedModal ──────────────────────────────────────────────────────────
function GetStartedModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const roles = [
    {
      key: "tenant", icon: Home,
      gradient: "from-emerald-500 to-cyan-500", glow: "rgba(16,185,129,0.25)",
      title: "Cư dân / Người thuê",
      desc: "Tìm phòng thuê bằng AI, đặt lịch xem, quản lý hóa đơn & hợp đồng",
      features: ["Tìm phòng bằng Super Broker AI","Chat & đặt lịch trực tiếp","Quản lý hóa đơn VietQR"],
      register: "/tenant/register", login: "/tenant/login",
    },
    {
      key: "landlord", icon: Building2,
      gradient: "from-violet-500 to-purple-600", glow: "rgba(139,92,246,0.25)",
      title: "Chủ nhà / Quản lý",
      desc: "Đăng tin cho thuê, quản lý cư dân & doanh thu với 4 AI Agents",
      features: ["Listing Verifier kiểm duyệt tự động","Dashboard doanh thu real-time","Smart Concierge 24/7"],
      register: "/landlord/register", login: "/landlord/login",
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 16 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-6">
          <p className="text-white/40 mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.14em" }}>CHÀO MỪNG ĐẾN VỚI</p>
          <h2 className="text-white font-black" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", letterSpacing: "-0.03em" }}>
            NestaViet<span style={{ color: "#a78bfa" }}>AI</span>
          </h2>
          <p className="text-white/35 mt-1" style={{ fontSize: "0.85rem" }}>Bạn muốn sử dụng với tư cách gì?</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {roles.map((role, i) => {
            const Icon = role.icon;
            return (
              <motion.div key={role.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 240, damping: 24 }}
                className="rounded-2xl overflow-hidden border border-white/10"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <div className={`bg-gradient-to-br ${role.gradient} p-5`} style={{ boxShadow: `0 8px 32px ${role.glow}` }}>
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold" style={{ fontSize: "1rem" }}>{role.title}</h3>
                  <p className="text-white/70 mt-1" style={{ fontSize: "0.78rem", lineHeight: 1.5 }}>{role.desc}</p>
                </div>
                <div className="p-4 space-y-2">
                  {role.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-white/35 flex-shrink-0" />
                      <span className="text-white/55" style={{ fontSize: "0.75rem" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(role.register)}
                    className={`flex-1 py-2.5 rounded-xl text-white font-bold flex items-center justify-center gap-1.5 bg-gradient-to-r ${role.gradient}`}
                    style={{ fontSize: "0.8rem" }}>
                    <UserPlus size={14} />Đăng ký mới
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(role.login)}
                    className="px-4 py-2.5 rounded-xl border border-white/20 text-white/65 hover:text-white hover:border-white/40 transition-colors flex items-center gap-1.5"
                    style={{ fontSize: "0.8rem" }}>
                    <LogIn size={14} />Đăng nhập
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="text-center">
          <button onClick={onClose} className="text-white/25 hover:text-white/55 transition-colors flex items-center gap-1.5 mx-auto" style={{ fontSize: "0.8rem" }}>
            <X size={14} />Đóng lại
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── AgentControlRoom ─────────────────────────────────────────────────────────
function AgentControlRoom() {
  const [aiTick, setAiTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setAiTick(i => i + 1), 2600);
    return () => clearInterval(id);
  }, []);
  const aiProcIdx = aiTick % 4;
  const logEntries = Array.from({ length: 5 }, (_, i) => AGENT_LOGS[(aiTick + i) % AGENT_LOGS.length]);
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-cyan-500/8 border border-cyan-500/15 rounded-full px-4 py-1.5 mb-4">
          <Bot size={13} className="text-cyan-400" />
          <span className="text-cyan-400" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>MULTI-AGENT AI ARCHITECTURE</span>
        </div>
        <h2 className="text-white mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
          AI Control Room · 4 agents · 24/7
        </h2>
        <p className="text-white/40 max-w-2xl mx-auto" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
          Kiến trúc đa tác nhân phân tán — mỗi Agent chuyên trách một nghiệp vụ, giao tiếp qua event-driven để xử lý xuyên suốt vòng đời hợp đồng thuê nhà
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-3xl overflow-hidden border border-white/8"
        style={{ background: "rgba(3,7,18,0.95)", backdropFilter: "blur(24px)" }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/6" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-white/22 font-mono" style={{ fontSize: "0.68rem" }}>nestavietai — agent-orchestrator · v2.1.0</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400/50 font-mono" style={{ fontSize: "0.62rem" }}>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/5">
          {AGENTS.map((agent, i) => {
            const isProc = aiProcIdx === i;
            const col = AGENT_COLORS[i];
            const m = AGENT_METRICS[i];
            return (
              <div key={agent.id} className="p-5 relative transition-colors duration-500"
                style={{ background: isProc ? "rgba(255,255,255,0.03)" : "transparent" }}>
                {isProc && <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${col}15 0%, transparent 70%)` }} />}
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.g} flex items-center justify-center transition-all duration-500`}
                      style={{ boxShadow: isProc ? `0 0 24px ${col}55` : "none" }}>
                      <agent.icon size={18} className="text-white" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full transition-all duration-500"
                      style={{ background: isProc ? `${col}20` : "rgba(52,211,153,0.1)", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.05em", color: isProc ? col : "#34d399" }}>
                      <motion.span animate={isProc ? { opacity: [1, 0.15, 1] } : { opacity: 1 }} transition={{ repeat: Infinity, duration: 0.7 }}
                        style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
                      {isProc ? "PROC..." : "ONLINE"}
                    </div>
                  </div>
                  <p className="text-white/20 mb-0.5" style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em" }}>AGENT {agent.id}</p>
                  <p className="text-white font-bold mb-1.5" style={{ fontSize: "0.9rem" }}>{agent.name}</p>
                  <p className="text-white/30 mb-4" style={{ fontSize: "0.68rem", lineHeight: 1.55 }}>{agent.desc}</p>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                    <p className="font-extrabold transition-colors duration-500"
                      style={{ fontSize: "1.5rem", letterSpacing: "-0.03em", color: isProc ? col : "rgba(255,255,255,0.85)" }}>{m.val}</p>
                    <p className="text-white/28" style={{ fontSize: "0.6rem" }}>{m.label}</p>
                    <p style={{ fontSize: "0.58rem", color: col, opacity: 0.55, marginTop: "2px" }}>{m.sub}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/5 px-6 py-4" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Activity size={12} className="text-white/20" />
            <span className="text-white/20 font-mono" style={{ fontSize: "0.62rem", letterSpacing: "0.08em" }}>EVENT STREAM · LIVE</span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400/35 font-mono" style={{ fontSize: "0.58rem" }}>streaming</span>
            </div>
          </div>
          <div className="space-y-1.5">
            {logEntries.map((log, i) => (
              <div key={i} className="flex items-start gap-3 font-mono" style={{ fontSize: "0.68rem", opacity: 1 - i * 0.17 }}>
                <span className="text-white/18 flex-shrink-0 tabular-nums" style={{ minWidth: "2.8rem" }}>
                  {String((aiTick * 7 + i * 11) % 60).padStart(2,"0")}:{String((aiTick * 13 + i * 17 + 23) % 60).padStart(2,"0")}
                </span>
                <span className="flex-shrink-0 font-bold" style={{ color: log.color, minWidth: "7rem", opacity: 0.75 }}>[{log.agent.split(" ").slice(0,2).join(" ")}]</span>
                <span className="text-white/30 flex-1 min-w-0 truncate">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── CommandPalette ───────────────────────────────────────────────────────────
function CommandPalette({ onClose, onLang, onGetStarted, t, navigate }: {
  onClose: () => void;
  onLang: () => void;
  onGetStarted: () => void;
  t: (vi: string, en: string) => string;
  navigate: (path: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const navCommands = [
    { type: "nav",    icon: Home,         label: t("Trang chủ","Home"),                      action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { type: "nav",    icon: UserPlus,     label: t("Đăng ký cư dân","Tenant signup"),         action: () => navigate("/tenant/register") },
    { type: "nav",    icon: LogIn,        label: t("Đăng nhập cư dân","Tenant login"),         action: () => navigate("/tenant/login") },
    { type: "nav",    icon: Building2,    label: t("Đăng ký chủ nhà","Landlord signup"),       action: () => navigate("/landlord/register") },
    { type: "nav",    icon: Globe,        label: "Manager Portal",                             action: () => navigate("/manager/login") },
    { type: "nav",    icon: Globe,        label: "Developer Portal",                           action: () => navigate("/dev/login") },
    { type: "nav",    icon: Shield,       label: t("Trang bảo mật","Security page"),           action: () => navigate("/security") },
    { type: "action", icon: Globe,        label: t("Đổi ngôn ngữ EN ↔ VI","Toggle EN ↔ VI"), action: () => { onLang(); onClose(); } },
    { type: "action", icon: ArrowRight,   label: t("Bắt đầu ngay","Get started free"),         action: () => { onGetStarted(); onClose(); } },
  ];

  const listingHits = query.trim().length >= 1
    ? LISTINGS.filter(l =>
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.district.toLowerCase().includes(query.toLowerCase()) ||
        l.amenities.some(a => a.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 4)
    : [];

  const navHits = query.trim().length >= 1
    ? navCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : navCommands;

  type Result = { type: string; label: string; sub: string; icon: typeof Home; action: () => void };
  const allResults: Result[] = [
    ...listingHits.map(l => ({ type: "listing", label: l.name, sub: `${l.district} · ${l.priceFrom}–${l.priceTo}M/tháng`, icon: Home, action: () => { onGetStarted(); onClose(); } })),
    ...navHits.map(c => ({ ...c, sub: "" })),
  ];

  const go = (i: number) => { allResults[i]?.action(); onClose(); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-start justify-center pt-[16vh] px-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(16px)" }}
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: -24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: -12 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="w-full max-w-xl rounded-2xl overflow-hidden"
        style={{ background: "rgba(4,9,20,0.98)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(34,211,238,0.06)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <Search size={16} className="text-white/28 flex-shrink-0" />
          <input ref={inputRef} type="text"
            placeholder={t("Tìm căn hộ, tính năng, điều hướng...","Search apartments, features, navigate...")}
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
            onKeyDown={e => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, allResults.length - 1)); }
              if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
              if (e.key === "Enter")     { go(activeIdx); }
              if (e.key === "Escape")    { onClose(); }
            }}
            className="flex-1 bg-transparent text-white placeholder-white/22 outline-none"
            style={{ fontSize: "0.95rem" }} />
          <span className="text-white/18 font-mono border border-white/10 px-1.5 py-0.5 rounded flex-shrink-0" style={{ fontSize: "0.65rem" }}>ESC</span>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {listingHits.length > 0 && (
            <p className="px-5 py-1.5 text-white/22" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em" }}>
              {t("CĂN HỘ","LISTINGS")}
            </p>
          )}
          {allResults.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-white/25" style={{ fontSize: "0.85rem" }}>{t("Không tìm thấy","No results")}</p>
            </div>
          )}
          {allResults.map((r, i) => {
            const Icon = r.icon;
            const isListing = r.type === "listing";
            return (
              <button key={i}
                onClick={() => go(i)}
                onMouseEnter={() => setActiveIdx(i)}
                className="w-full flex items-center gap-3 px-5 py-3 text-left transition-colors nv-cmd-result"
                style={{ background: i === activeIdx ? "rgba(34,211,238,0.07)" : undefined }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: isListing ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)" }}>
                  <Icon size={13} className={isListing ? "text-emerald-400" : "text-white/35"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80" style={{ fontSize: "0.85rem" }}>{r.label}</p>
                  {r.sub && <p className="text-white/28 truncate" style={{ fontSize: "0.7rem" }}>{r.sub}</p>}
                </div>
                {i === activeIdx && <ChevronRight size={13} className="text-white/22 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 px-5 py-3 border-t" style={{ background: "rgba(0,0,0,0.25)", borderColor: "rgba(255,255,255,0.06)" }}>
          {([["↑↓", t("điều hướng","navigate")], ["↵", t("chọn","select")], ["esc", t("đóng","close")]] as [string, string][]).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="text-white/18 font-mono border border-white/10 px-1.5 py-0.5 rounded" style={{ fontSize: "0.6rem" }}>{key}</span>
              <span className="text-white/20" style={{ fontSize: "0.66rem" }}>{label}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/18 font-mono" style={{ fontSize: "0.6rem" }}>NestaVietAI</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── useScrollSection ─────────────────────────────────────────────────────────
function useScrollSection<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return { ref, scrollYProgress };
}

// ─── ProductTour ──────────────────────────────────────────────────────────────
function ProductTour({ step, total, onNext, onSkip, t }: {
  step: number; total: number;
  onNext: () => void; onSkip: () => void;
  t: (vi: string, en: string) => string;
}) {
  const curr = TOUR_STEPS[step];
  const Icon = curr.icon;
  const isLast = step === total - 1;
  const positions: CSSProperties[] = [
    { top: "18vh", left: "50%", transform: "translateX(-50%)" },
    { top: "50vh", left: "50%", transform: "translateX(-50%)" },
    { top: "40vh", left: "50%", transform: "translateX(-50%)" },
    { bottom: "14vh", left: "50%", transform: "translateX(-50%)" },
  ];
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9985] pointer-events-none"
        style={{ background: "rgba(0,0,0,0.52)" }} />
      <div className="fixed inset-0 z-[9985]" onClick={onSkip} />
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.88, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="fixed z-[9986] pointer-events-auto"
        style={positions[step] as CSSProperties}>
        <div className="w-72 rounded-2xl p-5"
          style={{ background: "rgba(4,9,20,0.98)", border: "1px solid rgba(34,211,238,0.3)", boxShadow: "0 24px 64px rgba(0,0,0,0.85), 0 0 0 1px rgba(34,211,238,0.08)" }}>
          <div className="flex items-center gap-2 mb-3">
            {Array.from({ length: total }, (_, i) => (
              <div key={i} className="h-1 rounded-full transition-all duration-300"
                style={{ background: i <= step ? "#22d3ee" : "rgba(255,255,255,0.12)", width: i === step ? "20px" : "6px" }} />
            ))}
            <span className="ml-auto text-white/28" style={{ fontSize: "0.6rem" }}>{step + 1}/{total}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 nv-tour-ring"
              style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.3)" }}>
              <Icon size={18} style={{ color: "#22d3ee" }} />
            </div>
            <h3 className="text-white font-bold" style={{ fontSize: "0.95rem" }}>{curr.title}</h3>
          </div>
          <p className="text-white/45 mb-4" style={{ fontSize: "0.8rem", lineHeight: 1.65 }}>{curr.desc}</p>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={e => { e.stopPropagation(); onNext(); }}
              className="flex-1 py-2 rounded-xl text-white font-semibold flex items-center justify-center gap-1.5"
              style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)", fontSize: "0.82rem" }}>
              {isLast ? t("Bắt đầu!","Let's go!") : t("Tiếp theo","Next")}<ArrowRight size={13} />
            </motion.button>
            <button onClick={e => { e.stopPropagation(); onSkip(); }}
              className="px-3 py-2 text-white/28 hover:text-white/55 transition-colors" style={{ fontSize: "0.78rem" }}>
              {t("Bỏ qua","Skip")}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── LazyImage — skeleton + IntersectionObserver ──────────────────────────────
function LazyImage({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative w-full h-full">
      {!loaded && <div className="absolute inset-0 nv-skeleton" />}
      <img src={revealed ? src : undefined} alt={alt} className={className}
        style={{ ...style, opacity: loaded ? 1 : 0, transition: "opacity 0.35s ease" }}
        onLoad={() => setLoaded(true)} />
    </div>
  );
}

// ─── SocialProofBadge ─────────────────────────────────────────────────────────
function SocialProofBadge({ t }: { t: (vi: string, en: string) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const avatars = [
    "from-emerald-400 to-teal-500",
    "from-violet-400 to-purple-500",
    "from-cyan-400 to-blue-500",
    "from-orange-400 to-amber-500",
    "from-pink-400 to-rose-500",
  ];
  const initials = ["TH","ML","KN","VL","BT"];
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3">
      <div className="flex -space-x-2.5">
        {avatars.map((bg, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 22 }}
            className={`w-8 h-8 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center text-white font-bold border-2`}
            style={{ fontSize: "0.58rem", borderColor: "#030B14" }}>
            {initials[i]}
          </motion.div>
        ))}
      </div>
      <div>
        <p className="text-white/65 font-medium" style={{ fontSize: "0.8rem" }}>
          <motion.span key="count" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}>
            +124{" "}
          </motion.span>
          {t("người đang xem hôm nay","people viewing today")}
        </p>
      </div>
    </motion.div>
  );
}

// ─── MobileBottomNav ──────────────────────────────────────────────────────────
function MobileBottomNav({ onGetStarted, t }: { onGetStarted: () => void; t: (vi: string, en: string) => string }) {
  const navigate = useNavigate();
  const items = [
    { icon: Home,         label: t("Trang chủ","Home"),    action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { icon: Search,       label: t("Tìm kiếm","Search"),   action: () => { const el = document.querySelector("input[type=text]"); if (el) (el as HTMLElement).focus(); else window.scrollTo({ top: 400, behavior: "smooth" }); } },
    { icon: MessageSquare,label: "AI Chat",                action: onGetStarted, highlight: true },
    { icon: UserPlus,     label: t("Đăng ký","Sign up"),   action: onGetStarted },
  ];
  void navigate; // navigate available if needed later
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden"
      style={{ background: "rgba(3,7,18,0.94)", backdropFilter: "blur(20px) saturate(180%)", borderTop: "1px solid rgba(255,255,255,0.07)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="flex items-center py-2 px-4">
        {items.map(({ icon: Icon, label, action, highlight }) => (
          <button key={label} onClick={action} className="nv-mobile-nav-item">
            <div className={`w-6 h-6 flex items-center justify-center rounded-xl ${highlight ? "bg-gradient-to-br from-cyan-400 to-blue-500" : ""}`}
              style={highlight ? { boxShadow: "0 0 12px rgba(34,211,238,0.4)" } : undefined}>
              <Icon size={15} className={highlight ? "text-white" : "text-white/38"} />
            </div>
            <span style={{ fontSize: "0.56rem", fontWeight: 600, color: highlight ? "#22d3ee" : "rgba(255,255,255,0.28)" }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── WordReveal ───────────────────────────────────────────────────────────────
function WordReveal({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <span ref={ref} className={className} style={style}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="nv-word" style={{ marginRight: "0.25em" }}>
          <span className="nv-word-inner" style={{
            animationPlayState: inView ? "running" : "paused",
            animationDelay: `${i * 0.08}s`,
          }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

// ─── RentalCalculator ────────────────────────────────────────────────────────
function RentalCalculator({ t, onGetStarted }: { t: (vi: string, en: string) => string; onGetStarted: () => void }) {
  const [budget, setBudget] = useState(15);
  const [area, setArea] = useState(55);
  const [district, setDistrict] = useState("Tất cả quận");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const matching = LISTINGS.filter(l => {
    const inBudget = l.priceFrom <= budget;
    const inDistrict = district === "Tất cả quận" || l.district === district;
    const inArea = parseInt(l.area.split("–")[0]) <= area;
    return inBudget && inDistrict && inArea;
  });

  return (
    <section className="py-20 px-6 border-t border-white/5" style={{ background: "rgba(255,255,255,0.012)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
            style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)" }}>
            <Sliders size={13} className="text-emerald-400" />
            <span className="text-emerald-400" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>
              {t("Công Cụ Tự Động Tìm Kiếm Nhà Bằng AI","AI AUTO FIND RENTAL TOOL")}
            </span>
          </div>
          <h2 className="text-white mb-2" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            {t("Tìm căn hộ phù hợp","Find your perfect match")}
          </h2>
          <p className="text-white/35" style={{ fontSize: "0.88rem" }}>
            {t("Kéo slider — xem ngay căn hộ phù hợp ngân sách của bạn","Adjust sliders to instantly see matching apartments")}
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl p-6 space-y-7"
            style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)" }}>

            {/* Budget */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-white/55 font-semibold" style={{ fontSize: "0.82rem" }}>{t("Ngân sách tối đa","Max budget")}</label>
                <motion.span key={budget} initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="text-cyan-400 font-bold" style={{ fontSize: "1.1rem" }}>
                  {budget}M<span className="text-white/30 font-normal text-sm">/tháng</span>
                </motion.span>
              </div>
              <input type="range" min="5" max="40" step="1" value={budget} onChange={e => setBudget(+e.target.value)}
                className="w-full h-1.5 rounded-full"
                style={{ background: `linear-gradient(90deg, #22d3ee ${((budget - 5) / 35) * 100}%, rgba(255,255,255,0.1) 0%)` }} />
              <div className="flex justify-between mt-1.5">
                <span className="text-white/22" style={{ fontSize: "0.62rem" }}>5M</span>
                <span className="text-white/22" style={{ fontSize: "0.62rem" }}>40M</span>
              </div>
            </div>

            {/* Area */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-white/55 font-semibold" style={{ fontSize: "0.82rem" }}>{t("Diện tích tối thiểu","Min area")}</label>
                <motion.span key={area} initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="text-violet-400 font-bold" style={{ fontSize: "1.1rem" }}>
                  {area}m²
                </motion.span>
              </div>
              <input type="range" min="20" max="150" step="5" value={area} onChange={e => setArea(+e.target.value)}
                className="w-full h-1.5 rounded-full"
                style={{ background: `linear-gradient(90deg, #a78bfa ${((area - 20) / 130) * 100}%, rgba(255,255,255,0.1) 0%)` }} />
              <div className="flex justify-between mt-1.5">
                <span className="text-white/22" style={{ fontSize: "0.62rem" }}>20m²</span>
                <span className="text-white/22" style={{ fontSize: "0.62rem" }}>150m²</span>
              </div>
            </div>

            {/* District */}
            <div>
              <label className="text-white/55 font-semibold mb-2.5 block" style={{ fontSize: "0.82rem" }}>{t("Khu vực","District")}</label>
              <div className="flex flex-wrap gap-2">
                {DISTRICTS_FILTER.map(d => (
                  <button key={d} onClick={() => setDistrict(d)}
                    className="px-3 py-1.5 rounded-full transition-all"
                    style={{
                      fontSize: "0.72rem", fontWeight: 600,
                      background: district === d ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${district === d ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.1)"}`,
                      color: district === d ? "#22d3ee" : "rgba(255,255,255,0.42)",
                    }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Match count badge */}
            <div className="rounded-xl px-5 py-4" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)" }}>
              <div className="flex items-center gap-4">
                <motion.span key={matching.length} initial={{ scale: 1.4, color: "#22d3ee" }} animate={{ scale: 1, color: "#34d399" }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="font-black" style={{ fontSize: "2.2rem", letterSpacing: "-0.04em" }}>
                  {matching.length}
                </motion.span>
                <div>
                  <p className="text-white font-semibold" style={{ fontSize: "0.88rem" }}>{t("căn hộ phù hợp","matching apartments")}</p>
                  <p className="text-white/30" style={{ fontSize: "0.72rem" }}>{t("theo bộ lọc hiện tại","with current filters")}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}>
            <p className="text-white/40 font-semibold mb-4" style={{ fontSize: "0.72rem", letterSpacing: "0.08em" }}>
              {t("KẾT QUẢ PHÙ HỢP NHẤT","BEST MATCHES")}
            </p>
            <div className="space-y-3">
              <AnimatePresence>
                {matching.slice(0, 3).map((apt, i) => (
                  <motion.div key={apt.id} layout
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 rounded-2xl p-4 cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <img src={apt.img} alt={apt.name} loading="lazy" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate" style={{ fontSize: "0.85rem" }}>{apt.name}</p>
                      <p className="text-white/38 flex items-center gap-1 mt-0.5" style={{ fontSize: "0.72rem" }}>
                        <MapPin size={9} />{apt.district}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-cyan-400 font-bold" style={{ fontSize: "0.9rem" }}>{apt.priceFrom}M</p>
                      <p className="text-white/25" style={{ fontSize: "0.62rem" }}>/tháng</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {matching.length === 0 && (
                <div className="flex flex-col items-center justify-center h-44 text-center rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <Search size={26} className="text-white/12 mb-3" />
                  <p className="text-white/28" style={{ fontSize: "0.85rem" }}>{t("Không có căn hộ phù hợp","No matches found")}</p>
                  <p className="text-white/18 mt-1" style={{ fontSize: "0.72rem" }}>{t("Thử tăng ngân sách","Try increasing budget")}</p>
                </div>
              )}
              {matching.length > 3 && (
                <button onClick={onGetStarted}
                  className="w-full py-2.5 rounded-xl border border-white/8 text-white/38 hover:text-white/65 hover:border-white/18 transition-all text-center"
                  style={{ fontSize: "0.78rem" }}>
                  +{matching.length - 3} {t("căn hộ nữa","more apartments")} →
                </button>
              )}
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={onGetStarted}
              className="w-full mt-4 py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)", fontSize: "0.875rem", boxShadow: "0 0 20px rgba(34,211,238,0.18)" }}>
              <Bot size={15} />{t("Hỏi AI Super Broker","Ask AI Super Broker")}<ArrowRight size={14} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── StickyCompareBar ─────────────────────────────────────────────────────────
function StickyCompareBar({ selectedIds, onCompare, onClear, t }: {
  selectedIds: number[];
  onCompare: () => void;
  onClear: () => void;
  t: (vi: string, en: string) => string;
}) {
  const selected = LISTINGS.filter(l => selectedIds.includes(l.id));
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-[8000] md:bottom-5 md:left-1/2 md:right-auto md:w-auto md:-translate-x-1/2">
      <div className="flex items-center gap-3 px-5 py-3.5 md:rounded-2xl"
        style={{ background: "rgba(3,7,18,0.97)", backdropFilter: "blur(20px)", border: "1px solid rgba(34,211,238,0.18)", borderBottom: "none", borderRadius: "20px 20px 0 0", boxShadow: "0 -4px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,211,238,0.06)" }}>
        <div className="flex -space-x-2">
          {selected.map(l => (
            <img key={l.id} src={l.img} alt={l.name} className="w-9 h-9 rounded-xl object-cover border-2" style={{ borderColor: "#030B14" }} />
          ))}
          {selectedIds.length < 3 && (
            <div className="w-9 h-9 rounded-xl border-2 border-dashed border-white/18 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
              <span className="text-white/22" style={{ fontSize: "1.1rem", lineHeight: 1 }}>+</span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-shrink-0">
          <p className="text-white/55 font-semibold whitespace-nowrap" style={{ fontSize: "0.78rem" }}>
            {selectedIds.length} {t("đã chọn","selected")} · {t("tối đa 3","max 3")}
          </p>
        </div>
        <button onClick={onCompare}
          className="px-4 py-2 rounded-xl text-white font-semibold flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)", fontSize: "0.8rem", boxShadow: "0 0 16px rgba(34,211,238,0.25)" }}>
          {t("So sánh","Compare")}
        </button>
        <button onClick={onClear} className="text-white/25 hover:text-white/55 transition-colors flex-shrink-0"><X size={16} /></button>
      </div>
    </motion.div>
  );
}

// ─── ComparisonDrawer ─────────────────────────────────────────────────────────
function ComparisonDrawer({ selectedIds, onClose, t, onGetStarted }: {
  selectedIds: number[];
  onClose: () => void;
  t: (vi: string, en: string) => string;
  onGetStarted: () => void;
}) {
  const selected = LISTINGS.filter(l => selectedIds.includes(l.id));
  const criteria: { key: keyof typeof LISTINGS[0]; label: string; fmt: (v: unknown) => string }[] = [
    { key: "priceFrom", label: t("Giá từ","Price from"), fmt: v => `${v}M/tháng` },
    { key: "priceTo",   label: t("Giá đến","Price to"),  fmt: v => `${v}M/tháng` },
    { key: "area",      label: t("Diện tích","Area"),     fmt: v => `${v}` },
    { key: "rating",    label: t("Đánh giá","Rating"),    fmt: v => `${v}★` },
    { key: "available", label: t("Còn trống","Available"),fmt: v => `${v} phòng` },
  ];
  const cols = selected.length;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9000] flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(16px)" }}
      onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        onClick={e => e.stopPropagation()}
        className="rounded-t-3xl overflow-hidden overflow-y-auto"
        style={{ background: "rgba(3,7,18,0.98)", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "85vh" }}>
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/15 nv-drawer-handle" />
        </div>
        <div className="px-6 pb-4 flex items-center justify-between border-b border-white/7">
          <div>
            <h3 className="text-white font-bold" style={{ fontSize: "1.1rem" }}>{t("So sánh căn hộ","Compare Apartments")}</h3>
            <p className="text-white/35" style={{ fontSize: "0.78rem" }}>{selected.length} {t("căn hộ đã chọn","apartments selected")}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/65 transition-colors"><X size={22} /></button>
        </div>

        <div className="p-6">
          {/* Images + names */}
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `160px repeat(${cols}, 1fr)` }}>
            <div />
            {selected.map(apt => (
              <div key={apt.id} className="text-center">
                <div className="rounded-2xl overflow-hidden mb-3" style={{ height: "120px" }}>
                  <img src={apt.img} alt={apt.name} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <p className="text-white font-bold" style={{ fontSize: "0.78rem", lineHeight: 1.3 }}>{apt.name}</p>
                <p className="text-cyan-400 font-semibold mt-0.5" style={{ fontSize: "0.82rem" }}>{apt.priceFrom}–{apt.priceTo}M</p>
                <p className="text-white/30" style={{ fontSize: "0.65rem" }}>{apt.district}</p>
              </div>
            ))}
          </div>

          {/* Rows */}
          {criteria.map(({ key, label, fmt }) => (
            <div key={key} className="grid gap-4 py-3.5" style={{ gridTemplateColumns: `160px repeat(${cols}, 1fr)`, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-white/35 flex items-center" style={{ fontSize: "0.78rem" }}>{label}</p>
              {selected.map(apt => (
                <div key={apt.id} className="text-center">
                  <p className="text-white font-semibold" style={{ fontSize: "0.82rem" }}>{fmt(apt[key])}</p>
                </div>
              ))}
            </div>
          ))}

          {/* Amenities */}
          <div className="grid gap-4 py-3.5" style={{ gridTemplateColumns: `160px repeat(${cols}, 1fr)`, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-white/35 flex items-start pt-0.5" style={{ fontSize: "0.78rem" }}>{t("Tiện ích","Amenities")}</p>
            {selected.map(apt => (
              <div key={apt.id} className="flex flex-wrap gap-1 justify-center">
                {apt.amenities.map(a => (
                  <span key={a} className="px-1.5 py-0.5 rounded-md text-white/40"
                    style={{ fontSize: "0.58rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>{a}</span>
                ))}
              </div>
            ))}
          </div>

          {/* AI Summary */}
          <div className="mt-5 rounded-2xl p-5" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Bot size={14} className="text-cyan-400" />
              <span className="text-cyan-400 font-semibold" style={{ fontSize: "0.78rem" }}>AI {t("phân tích","analysis")}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>
            <p className="text-white/48" style={{ fontSize: "0.8rem", lineHeight: 1.7 }}>
              {selected.length >= 2
                ? `${selected[0]?.name} ${t("phù hợp hơn với ngân sách hẹp và số phòng trống cao hơn. Trong khi","is better for tighter budgets with more availability. Meanwhile,")} ${selected[1]?.name} ${t("nổi bật với rating cao hơn và tiện ích cao cấp.","stands out with a higher rating and premium amenities.")}`
                : t("Chọn thêm căn hộ để AI tổng hợp điểm mạnh và yếu chi tiết.", "Select more apartments for detailed AI pros & cons analysis.")}
            </p>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { onGetStarted(); onClose(); }}
            className="w-full mt-5 py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)", fontSize: "0.9rem" }}>
            {t("Đặt lịch xem ngay","Schedule a tour")}<ArrowRight size={15} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── NeighborhoodHeatmap ──────────────────────────────────────────────────────
const REGION_TABS = [
  { key: "north"   as const, vi: "Miền Bắc",  en: "North",   color: "#22d3ee" },
  { key: "central" as const, vi: "Miền Trung", en: "Central", color: "#a78bfa" },
  { key: "south"   as const, vi: "Miền Nam",   en: "South",   color: "#34d399" },
];

function NeighborhoodHeatmap({ t }: { t: (vi: string, en: string) => string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<"north" | "central" | "south">("south");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });

  const getTheme = (avg: number) => {
    const ratio = Math.min((avg - 3) / 14, 1);
    if (ratio < 0.2) return { bg: "#10b981", glow: "rgba(16,185,129,0.35)" };
    if (ratio < 0.4) return { bg: "#22d3ee", glow: "rgba(34,211,238,0.35)" };
    if (ratio < 0.6) return { bg: "#8b5cf6", glow: "rgba(139,92,246,0.35)" };
    if (ratio < 0.8) return { bg: "#f59e0b", glow: "rgba(245,158,11,0.35)" };
    return { bg: "#ef4444", glow: "rgba(239,68,68,0.35)" };
  };

  const provinces = VIETNAM_PROVINCES[activeRegion];
  const hoveredData = provinces.find(d => d.id === hovered) ?? null;
  const activeTab = REGION_TABS.find(r => r.key === activeRegion)!;

  return (
    <section className="py-20 px-6 border-t border-white/5" style={{ background: "rgba(255,255,255,0.01)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
            style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.18)" }}>
            <MapPin size={13} className="text-cyan-400" />
            <span className="text-cyan-400" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>
              {t("GIÁ THUÊ THEO TỈNH THÀNH · 34 TỈNH THÀNH TỪ 01/07/2025","RENTAL PRICES · 34 PROVINCES FROM 01/07/2025")}
            </span>
          </div>
          <h2 className="text-white mb-3" style={{ fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            <WordReveal text={t("Heatmap giá thuê Việt Nam","Vietnam Rental Heatmap")} />
          </h2>
          <p className="text-white/35 max-w-xl mx-auto" style={{ fontSize: "0.87rem", lineHeight: 1.7 }}>
            {t("Dữ liệu 34 tỉnh thành theo định danh mới từ 01/07/2025. Hover để xem thống kê AI.","Data for all 34 provinces per new Jul 2025 admin divisions. Hover for AI stats.")}
          </p>
        </motion.div>

        {/* Region tabs */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex justify-center gap-2 mb-8">
          {REGION_TABS.map(tab => {
            const active = tab.key === activeRegion;
            return (
              <button key={tab.key}
                onClick={() => { setActiveRegion(tab.key); setHovered(null); }}
                className="px-5 py-2 rounded-full font-semibold transition-all"
                style={{
                  fontSize: "0.82rem",
                  background: active ? `${tab.color}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${active ? tab.color + "55" : "rgba(255,255,255,0.08)"}`,
                  color: active ? tab.color : "rgba(255,255,255,0.38)",
                  boxShadow: active ? `0 0 16px ${tab.color}20` : "none",
                }}>
                {t(tab.vi, tab.en)}
              </button>
            );
          })}
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Province grid */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={activeRegion}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.22 }}
                className="flex flex-wrap gap-2 justify-center">
                {provinces.map((d, i) => {
                  const { bg, glow } = getTheme(d.avg);
                  const isHot = hovered === d.id;
                  return (
                    <motion.div key={d.id}
                      initial={{ opacity: 0, scale: 0.75 }}
                      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.75 }}
                      transition={{ delay: i * 0.03, type: "spring", stiffness: 220, damping: 22 }}
                      whileHover={{ scale: 1.1, zIndex: 2 }}
                      className="nv-heatmap-cell rounded-xl flex flex-col items-center justify-center text-center select-none cursor-pointer"
                      style={{
                        width: "90px", height: "68px",
                        background: `${bg}${isHot ? "28" : "12"}`,
                        border: `1px solid ${bg}${isHot ? "75" : "28"}`,
                        boxShadow: isHot ? `0 8px 24px ${glow}` : "none",
                        transition: "background 0.2s, border 0.2s, box-shadow 0.2s",
                      }}
                      onMouseEnter={() => setHovered(d.id)}
                      onMouseLeave={() => setHovered(null)}>
                      <p className="font-bold leading-tight px-1" style={{ fontSize: "0.68rem", color: bg, lineHeight: 1.2 }}>{d.name}</p>
                      <p className="text-white/40 mt-0.5" style={{ fontSize: "0.58rem" }}>{d.avg}M</p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
            {/* Legend */}
            <div className="flex items-center justify-center gap-2 mt-5">
              <span className="text-white/28" style={{ fontSize: "0.65rem" }}>{t("Rẻ","Low")}</span>
              <div className="h-1.5 w-36 rounded-full" style={{ background: "linear-gradient(90deg,#10b981,#22d3ee,#8b5cf6,#f59e0b,#ef4444)" }} />
              <span className="text-white/28" style={{ fontSize: "0.65rem" }}>{t("Đắt","High")}</span>
            </div>
            <p className="text-center text-white/18 mt-2" style={{ fontSize: "0.6rem" }}>
              {t("* Theo định danh hành chính mới từ 01/07/2025","* Based on new administrative divisions from 01/07/2025")}
            </p>
          </div>

          {/* Info panel */}
          <div className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", minHeight: "260px" }}>
            <AnimatePresence mode="wait">
              {hoveredData ? (
                <motion.div key={hoveredData.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}>
                  {(() => {
                    const { bg } = getTheme(hoveredData.avg);
                    return (
                      <>
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${bg}20`, border: `1px solid ${bg}30` }}>
                            <MapPin size={18} style={{ color: bg }} />
                          </div>
                          <div>
                            <h3 className="text-white font-bold" style={{ fontSize: "1.1rem" }}>{hoveredData.name}</h3>
                            <p className="text-white/35" style={{ fontSize: "0.72rem" }}>{hoveredData.sub} · {t(activeTab.vi, activeTab.en)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-5">
                          {[
                            { label: t("Giá trung bình","Avg. rent"), val: `${hoveredData.avg}M/tháng`, color: bg },
                            { label: t("Khoảng giá","Range"), val: `${Math.round(hoveredData.avg * 0.72)}–${Math.round(hoveredData.avg * 1.5)}M`, color: "#a78bfa" },
                            { label: t("Phường/xã (mới)","Wards (new)"), val: hoveredData.wards ? `${hoveredData.wards} đơn vị` : `${Math.round(hoveredData.avg * 14)}+`, color: "#22d3ee" },
                            { label: t("Đánh giá","Avg. rating"), val: `${(4.1 + (hoveredData.avg % 7) * 0.1).toFixed(1)}★`, color: "#fbbf24" },
                          ].map(({ label, val, color }) => (
                            <div key={label} className="rounded-xl p-3" style={{ background: `${color}0a`, border: `1px solid ${color}18` }}>
                              <p className="font-bold" style={{ color, fontSize: "0.95rem" }}>{val}</p>
                              <p className="text-white/32 mt-0.5" style={{ fontSize: "0.65rem" }}>{label}</p>
                            </div>
                          ))}
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="w-full py-2.5 rounded-xl text-white font-semibold"
                          style={{ background: `linear-gradient(135deg,${bg},${bg}99)`, fontSize: "0.82rem" }}>
                          {t("Xem căn hộ tại","View listings in")} {hoveredData.name} →
                        </motion.button>
                      </>
                    );
                  })()}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex flex-col items-center justify-center h-56 text-center">
                    <MapPin size={32} className="text-white/10 mb-3" />
                    <p className="text-white/25" style={{ fontSize: "0.88rem" }}>
                      {t("Hover vào tỉnh thành để xem thống kê giá","Hover over a province to see AI stats")}
                    </p>
                    <p className="text-white/13 mt-2" style={{ fontSize: "0.72rem" }}>
                      {provinces.length} {t("tỉnh thành","provinces")} · {activeTab.vi}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MarketInsights ───────────────────────────────────────────────────────────
function MarketInsights({ t }: { t: (vi: string, en: string) => string }) {
  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3"
              style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.16)" }}>
              <TrendingUp size={12} className="text-cyan-400" />
              <span className="text-cyan-400" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em" }}>
                {t("THÔNG TIN THỊ TRƯỜNG","MARKET INSIGHTS")}
              </span>
            </div>
            <h2 className="text-white" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
              {t("Góc nhìn AI về thị trường","AI-powered market view")}
            </h2>
          </div>
          <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors" style={{ fontSize: "0.875rem" }}>
            {t("Tất cả bài viết","All articles")}<ArrowRight size={15} />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MARKET_ARTICLES.map((a, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 120, damping: 20 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl overflow-hidden cursor-pointer group"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="h-1" style={{ background: `linear-gradient(90deg,${a.color},transparent)` }} />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded-full font-semibold"
                    style={{ fontSize: "0.62rem", background: `${a.color}18`, color: a.color, border: `1px solid ${a.color}25` }}>
                    {a.category}
                  </span>
                  <span className="text-white/20" style={{ fontSize: "0.62rem" }}>{a.date}</span>
                </div>
                <h3 className="text-white font-bold mb-3 group-hover:text-cyan-400/80 transition-colors"
                  style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>{a.title}</h3>
                <p className="text-white/35 mb-5"
                  style={{ fontSize: "0.78rem", lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {a.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-white/22" style={{ fontSize: "0.68rem" }}>{a.readTime}</span>
                  <span className="font-mono" style={{ fontSize: "0.64rem", color: a.color }}>{a.tag}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── LandingPage ──────────────────────────────────────────────────────────────
export function LandingPage() {
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLang("landing");
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [chatTrigger, setChatTrigger] = useState<{ query: string; id: number } | undefined>();
  const [contactListing, setContactListing] = useState<null | { id: string; title: string; price: string; area: string; district: string; description: string; type: string }>(null);

  // New feature state
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [selectedListings, setSelectedListings] = useState<number[]>([]);
  const [showComparisonDrawer, setShowComparisonDrawer] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);

  const openGetStarted = () => {
    setShowGetStarted(true);
    setTourStep(null);
    try { localStorage.setItem("nv-tour-done", "true"); } catch { /* noop */ }
  };

  const toggleCompare = (id: number) => {
    setSelectedListings(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  // Page-level scroll
  const { scrollYProgress: pageScrollProgress } = useScroll();
  const progressWidth = useTransform(pageScrollProgress, [0, 1], ["0%", "100%"]);

  // Section refs for scroll-linked animations
  const heroRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);
  const listingsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScrollProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: howScrollProgress }  = useScroll({ target: howRef,  offset: ["start end", "end start"] });
  const { scrollYProgress: listingsScrollProgress } = useScroll({ target: listingsRef, offset: ["start end", "end start"] });
  const { scrollYProgress: ctaScrollProgress }  = useScroll({ target: ctaRef,  offset: ["start end", "end start"] });

  // Hero parallax transforms
  const headlineY     = useTransform(heroScrollProgress, [0, 0.6], [0, -120]);
  const subTextY      = useTransform(heroScrollProgress, [0, 0.6], [0, -60]);
  const widgetY       = useTransform(heroScrollProgress, [0, 0.6], [0, 40]);
  const widgetOpacity = useTransform(heroScrollProgress, [0, 0.4], [1, 0]);
  const heroBlobAY    = useTransform(heroScrollProgress, [0, 1], [0, -160]);
  const heroBlobBY    = useTransform(heroScrollProgress, [0, 1], [0, -70]);

  // Section-specific transforms
  const connectorScale = useTransform(howScrollProgress,      [0.1, 0.5], [0, 1]);
  const listingsDrift  = useTransform(listingsScrollProgress, [0, 1],     [0, -40]);
  const ctaGlowX       = useTransform(ctaScrollProgress,      [0, 1],     ["-20%", "20%"]);

  // Force dark mode always — page is always dark
  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
    return () => {
      // On unmount, restore from localStorage if available
      try {
        const saved = localStorage.getItem("nv-theme");
        if (saved === "light") document.documentElement.setAttribute("data-theme", "light");
        else document.documentElement.removeAttribute("data-theme");
      } catch {}
    };
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ⌘K / Ctrl+K command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowCommandPalette(v => !v); }
      if (e.key === "Escape") { setShowCommandPalette(false); setShowComparisonDrawer(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Product tour — trigger once for first-time visitors
  useEffect(() => {
    try {
      const done = localStorage.getItem("nv-tour-done");
      if (!done) {
        const timer = setTimeout(() => setTourStep(0), 2000);
        return () => clearTimeout(timer);
      }
    } catch { /* noop */ }
  }, []);

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: "#030B14" }}>
      {/* Scroll progress line */}
      <motion.div className="nv-scroll-line" style={{ width: progressWidth }} />
      <AnimatePresence>{showGetStarted && <GetStartedModal onClose={() => setShowGetStarted(false)} />}</AnimatePresence>
      <AnimatePresence>
        {contactListing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(16px)" }}
            onClick={() => setContactListing(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl overflow-hidden border border-white/10"
              style={{ background: "rgba(5,10,24,0.97)", backdropFilter: "blur(24px)" }}>
              <div className="p-6 border-b border-white/7">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="text-white font-bold" style={{ fontSize: "1rem", lineHeight: 1.4 }}>{contactListing.title}</h3>
                  <button onClick={() => setContactListing(null)} className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"><X size={18} /></button>
                </div>
                <p className="text-emerald-400 font-bold" style={{ fontSize: "1.05rem" }}>{contactListing.price}</p>
                <p className="text-white/38 mt-0.5" style={{ fontSize: "0.78rem" }}>{contactListing.area} · {contactListing.district}</p>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-white/50 text-sm mb-4" style={{ lineHeight: 1.65 }}>{contactListing.description}</p>
                {[
                  { icon: MessageSquare, label: t("Hỏi AI Super Broker","Ask AI Super Broker"), sub: t("Tư vấn 24/7 · Phản hồi trong 1.2s","24/7 advisory · Response in 1.2s"), color: "#22d3ee", action: () => { setChatTrigger({ query: `Tôi muốn hỏi về tin đăng: "${contactListing.title}" — ${contactListing.price}, ${contactListing.area}, ${contactListing.district}. Có thể tư vấn cho tôi không?`, id: Date.now() }); setContactListing(null); } },
                  { icon: UserPlus, label: t("Đăng ký để liên hệ chủ nhà","Register to contact landlord"), sub: t("Miễn phí · Bảo mật thông tin","Free · Privacy protected"), color: "#a78bfa", action: () => { setContactListing(null); setShowGetStarted(true); } },
                ].map(({ icon: Icon, label, sub, color, action }) => (
                  <motion.button key={label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={action}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all"
                    style={{ background: `${color}0a`, borderColor: `${color}22` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}44`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}22`; }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-white font-semibold" style={{ fontSize: "0.88rem" }}>{label}</p>
                      <p className="text-white/38 mt-0.5" style={{ fontSize: "0.72rem" }}>{sub}</p>
                    </div>
                    <ChevronRight size={15} className="ml-auto text-white/20" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ChatWidget trigger={chatTrigger} />

      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <CommandPalette
            onClose={() => setShowCommandPalette(false)}
            onLang={toggleLang}
            onGetStarted={() => { setShowGetStarted(true); setShowCommandPalette(false); }}
            t={t}
            navigate={navigate}
          />
        )}
      </AnimatePresence>

      {/* Product Tour */}
      <AnimatePresence>
        {tourStep !== null && (
          <ProductTour
            step={tourStep}
            total={TOUR_STEPS.length}
            t={t}
            onNext={() => {
              if (tourStep < TOUR_STEPS.length - 1) { setTourStep(tourStep + 1); }
              else { setTourStep(null); try { localStorage.setItem("nv-tour-done","true"); } catch { /**/ } setShowGetStarted(true); }
            }}
            onSkip={() => { setTourStep(null); try { localStorage.setItem("nv-tour-done","true"); } catch { /**/ } }}
          />
        )}
      </AnimatePresence>

      {/* Comparison Drawer */}
      <AnimatePresence>
        {showComparisonDrawer && (
          <ComparisonDrawer selectedIds={selectedListings} onClose={() => setShowComparisonDrawer(false)} t={t} onGetStarted={() => setShowGetStarted(true)} />
        )}
      </AnimatePresence>

      {/* Sticky Compare Bar */}
      <AnimatePresence>
        {selectedListings.length > 0 && !showComparisonDrawer && (
          <StickyCompareBar
            selectedIds={selectedListings}
            onCompare={() => setShowComparisonDrawer(true)}
            onClear={() => setSelectedListings([])}
            t={t}
          />
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav onGetStarted={() => setShowGetStarted(true)} t={t} />

      {/* ── FIXED BACKGROUND ─────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Radial orbs — scroll-driven parallax */}
        <motion.div style={{ y: heroBlobAY, top: "-10%", left: "-5%", width: "70%", height: "80%", background: "radial-gradient(ellipse, rgba(34,211,238,0.14) 0%, transparent 65%)", filter: "blur(40px)" }} className="absolute" />
        <motion.div style={{ y: heroBlobBY, top: "20%", right: "-10%", width: "65%", height: "75%", background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 65%)", filter: "blur(50px)" }} className="absolute" />
        <div className="absolute" style={{ bottom: "10%", left: "25%", width: "55%", height: "50%", background: "radial-gradient(ellipse, rgba(52,211,153,0.08) 0%, transparent 65%)", filter: "blur(60px)" }} />
        {/* Dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(rgba(148,163,184,0.022) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }} />
        {/* Horizontal accent line */}
        <div className="absolute left-0 right-0" style={{ top: "100vh", height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.12) 30%, rgba(139,92,246,0.12) 70%, transparent 100%)" }} />
      </div>

      {/* ── NAVBAR ───────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-[9990] transition-all duration-300"
        style={{
          background: scrolled ? "rgba(3,7,18,0.8)" : "rgba(3,7,18,0.45)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 select-none flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center"
              style={{ boxShadow: "0 0 16px rgba(34,211,238,0.3)", border: "1px solid rgba(255,255,255,0.18)" }}>
              <Building2 size={16} className="text-white" />
            </div>
            <span style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.04em" }}>
              NestaViet<span className="text-cyan-400">AI</span>
            </span>
          </button>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {[
              { label: t("Căn hộ","Listings"), href: null },
              { label: t("Tính năng","Features"), href: null },
              { label: t("Bảo mật","Security"), href: "/security" },
              { label: t("Tải app","Download"), href: null },
            ].map(({ label, href }) => (
              <button key={label} onClick={() => href ? navigate(href) : setShowGetStarted(true)}
                className="px-4 py-2 rounded-lg text-white/45 hover:text-white/80 hover:bg-white/5 transition-all"
                style={{ fontSize: "0.85rem" }}>
                {label}
              </button>
            ))}
          </nav>

          {/* Controls — no theme toggle, force dark always */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* ⌘K hint */}
            <button onClick={() => setShowCommandPalette(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/28 hover:text-white/55 transition-all"
              style={{ fontSize: "0.72rem", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
              <Search size={11} className="text-white/25" />
              <span>⌘K</span>
            </button>
            <button onClick={toggleLang}
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-white/40 hover:text-white/75 hover:bg-white/6 transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.67rem", fontWeight: 700 }}>
              {lang === "vi" ? "EN" : "VI"}
            </button>

            <button onClick={() => navigate("/tenant/login")}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-white/65 hover:text-white transition-all"
              style={{ fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.11)", background: "rgba(255,255,255,0.04)" }}>
              {t("Cư dân","Tenant")}
            </button>

            {/* Portal dropdown */}
            <div className="relative group hidden md:block">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-white/35 hover:text-white/65 transition-all"
                style={{ fontSize: "0.78rem", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.025)" }}>
                <Globe size={12} />{t("Cổng khác","Portals")}
              </button>
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/10 shadow-2xl overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all"
                style={{ background: "rgba(3,7,18,0.97)", backdropFilter: "blur(16px)" }}>
                {[
                  { label: t("Quản lý toà nhà","Building Manager"), sub: "manager.nestaviet.vn", path: "/manager/login", color: "text-emerald-400" },
                  { label: "Developer Portal",                       sub: "dev.nestaviet.vn",     path: "/dev/login",     color: "text-blue-400"   },
                  { label: "Admin Portal",                           sub: "admin.nestaviet.vn",   path: "/admin/login",   color: "text-violet-400" },
                ].map(p => (
                  <button key={p.path} onClick={() => navigate(p.path)}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/6 last:border-0">
                    <p className={`font-semibold ${p.color}`} style={{ fontSize: "0.8rem" }}>{p.label}</p>
                    <p className="text-white/22 font-mono mt-0.5" style={{ fontSize: "0.62rem" }}>{p.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => openGetStarted()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white font-semibold"
              style={{ fontSize: "0.83rem", background: "linear-gradient(135deg,#22d3ee,#3b82f6)", boxShadow: "0 0 18px rgba(34,211,238,0.25)" }}>
              {t("Bắt đầu","Get Started")}<ArrowRight size={13} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-visible">

        {/* Sparkle orbs — reduced to 4 for performance */}
        <div className="absolute top-[20%] left-[8%] w-48 h-48 rounded-full pointer-events-none nv-orb-1"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.22) 0%, transparent 70%)", filter: "blur(12px)" }} />
        <div className="absolute bottom-[25%] right-[10%] w-64 h-64 rounded-full pointer-events-none nv-orb-2"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)", filter: "blur(16px)" }} />
        {/* Glow rings */}
        <div className="absolute top-[10%] left-[5%] w-[200px] h-[200px] rounded-full pointer-events-none nv-orb-1"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.28) 0%, transparent 60%)", filter: "blur(8px)", opacity: 0.3 }} />
        <div className="absolute bottom-[20%] right-[8%] w-[150px] h-[150px] rounded-full pointer-events-none nv-orb-2"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.32) 0%, transparent 60%)", filter: "blur(6px)", opacity: 0.32 }} />

        {/* Floating live widget — scroll-driven */}
        <motion.div className="relative w-full max-w-5xl mx-auto" style={{ y: widgetY, opacity: widgetOpacity }}>
          <HeroLiveWidget />
        </motion.div>

        {/* Tag chip — dramatic entrance */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 280, damping: 22 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.035]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/55" style={{ fontSize: "0.76rem", fontWeight: 500 }}>
            {t("Nền tảng PropTech #1 Việt Nam 2025","#1 PropTech Platform Vietnam 2025")}
          </span>
        </motion.div>

        {/* Main headline — blur-in entrance + scroll parallax (separate layers) */}
        <motion.div style={{ y: headlineY }} className="relative z-10 max-w-5xl w-full">
          <motion.h1
            initial={{ opacity: 0, y: 60, filter: "blur(16px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.16, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-white text-center"
            style={{ fontSize: "clamp(3rem,8.5vw,7.5rem)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.045em" }}>
            {t("Thuê căn hộ","Rent smarter")}
            <br />
            <span className="nv-hero-gradient">
              {t("thông minh hơn","with AI.")}
            </span>
            <br />
            <span className="text-white/50" style={{ fontWeight: 800 }}>{t("với AI.","Manage better.")}</span>
          </motion.h1>
        </motion.div>

        {/* Subheadline — blur-in entrance + scroll parallax (separate layers) */}
        <motion.div style={{ y: subTextY }} className="mt-8 max-w-xl mx-auto w-full">
          <motion.p
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.32, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/40 text-center"
            style={{ fontSize: "clamp(0.95rem,1.8vw,1.1rem)", lineHeight: 1.75 }}>
          {t(
            "Hệ thống Multi-Agent AI tự động hóa toàn bộ — từ kiểm duyệt, tư vấn đến quản lý hợp đồng và thu tiền.",
            "Multi-Agent AI automates the entire rental lifecycle — verification, advisory, contracts, and payments."
          )}
          </motion.p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.44, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-10 w-full max-w-2xl">
          <div className="flex gap-2">
            <div className="flex items-center gap-3 flex-1 rounded-2xl px-5 py-3.5 border transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: searchFocused ? "rgba(34,211,238,0.45)" : "rgba(255,255,255,0.1)",
                boxShadow: searchFocused ? "0 0 0 4px rgba(34,211,238,0.07), 0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.2)",
                backdropFilter: "blur(20px)",
              }}>
              <Search size={17} className="text-white/28 flex-shrink-0" />
              <input
                type="text"
                placeholder={t("Nhập địa điểm, tên chung cư...","Search by location or building name...")}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                onKeyDown={e => { if (e.key === "Enter") { const q = searchQuery.trim(); if (q) { setChatTrigger({ query: `Tôi đang tìm căn hộ: ${q}. Bạn có thể tư vấn giúp tôi không?`, id: Date.now() }); setSearchFocused(false); } else setShowGetStarted(true); } }}
                className="bg-transparent flex-1 text-white placeholder-white/22 outline-none"
                style={{ fontSize: "0.92rem" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-white/28 hover:text-white/55 transition-colors flex-shrink-0">
                  <X size={14} />
                </button>
              )}
            </div>
            <button onClick={() => { const q = searchQuery.trim(); if (q) { setChatTrigger({ query: `Tôi đang tìm căn hộ: ${q}. Bạn có thể tư vấn giúp tôi không?`, id: Date.now() }); setSearchFocused(false); } else setShowGetStarted(true); }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-white hover:opacity-90 transition-opacity flex-shrink-0"
              style={{ fontSize: "0.88rem", background: "linear-gradient(135deg,#22d3ee,#3b82f6)", boxShadow: "0 0 20px rgba(34,211,238,0.22)" }}>
              <Search size={15} />{t("Tìm","Search")}
            </button>
          </div>

          {/* Search dropdown */}
          {searchFocused && searchQuery.trim().length >= 2 && (() => {
            const q = searchQuery.trim().toLowerCase();
            const results = LISTINGS.filter(l =>
              l.name.toLowerCase().includes(q) ||
              l.district.toLowerCase().includes(q) ||
              l.amenities.some(a => a.toLowerCase().includes(q))
            );
            return (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-white/12 overflow-hidden z-50"
                style={{ background: "rgba(5,10,24,0.97)", backdropFilter: "blur(24px)" }}>
                {results.length > 0 ? (
                  <>
                    <div className="px-4 py-2.5 border-b border-white/7">
                      <span className="text-white/35" style={{ fontSize: "0.72rem" }}>{results.length} kết quả</span>
                    </div>
                    {results.map(apt => (
                      <button key={apt.id} onClick={() => { setSearchQuery(apt.name); setChatTrigger({ query: `Tôi quan tâm đến ${apt.name} tại ${apt.district}. Giá ${apt.priceFrom}–${apt.priceTo}M/tháng. Bạn có thể tư vấn thêm không?`, id: Date.now() }); setSearchFocused(false); }}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={apt.img} alt={apt.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white" style={{ fontSize: "0.85rem", fontWeight: 600 }}>{apt.name}</p>
                          <p className="text-white/40 flex items-center gap-1" style={{ fontSize: "0.72rem" }}>
                            <MapPin size={10} />{apt.district} · {apt.priceFrom}–{apt.priceTo}M/tháng
                          </p>
                        </div>
                        <span className="inline-block px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: apt.badgeHex + "22", color: apt.badgeHex, fontSize: "0.62rem", fontWeight: 600 }}>{apt.badge}</span>
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-3 border-b border-white/7">
                    <p className="text-white/45" style={{ fontSize: "0.8rem" }}>Không tìm thấy "{searchQuery}"</p>
                  </div>
                )}
                <button onClick={() => {
                  const q = searchQuery.trim();
                  setChatTrigger({ query: `Tôi đang tìm căn hộ tại ${q}. Bạn có thể tư vấn giúp tôi không?`, id: Date.now() });
                  setSearchFocused(false);
                }} className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-500/8 transition-colors">
                  <span className="flex items-center gap-2 text-cyan-400" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    <Bot size={15} />Hỏi AI Super Broker về "{searchQuery}"
                  </span>
                  <ChevronRight size={14} className="text-cyan-400/60" />
                </button>
              </motion.div>
            );
          })()}
        </motion.div>

        {/* Trust stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-10">
          {[
            { val: "12,400+", label: t("Căn hộ đã xác thực","Verified listings"), color: "#22d3ee" },
            { val: "4.9★",     label: t("App Store","App Store"),                  color: "#fbbf24" },
            { val: "98%",      label: t("Khách hài lòng","Satisfaction rate"),     color: "#34d399" },
          ].map(({ val, label, color }) => (
            <div key={label} className="flex items-center gap-2.5">
              <span className="text-white font-bold" style={{ fontSize: "1.05rem", color }}>{val}</span>
              <span className="text-white/35" style={{ fontSize: "0.78rem" }}>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons — staggered */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.45 }}
            onClick={() => setShowGetStarted(true)}
            className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white hover:opacity-90 transition-opacity"
            style={{ fontSize: "0.92rem", background: "linear-gradient(135deg,#34d399,#22d3ee)", boxShadow: "0 0 24px rgba(52,211,153,0.22)" }}>
            {t("Đăng ký miễn phí","Sign up free")}<ArrowRight size={16} />
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.45 }}
            onClick={() => setShowGetStarted(true)}
            className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
            style={{ fontSize: "0.9rem" }}>
            <Play size={14} className="text-violet-400" />{t("Xem demo","Watch demo")}
          </motion.button>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/18"
          style={{ fontSize: "0.62rem" }}>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-5 h-8 rounded-full border border-white/12 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/25" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── MARQUEE STRIP ────────────────────────────────────────── */}
      <div className="border-y overflow-hidden relative select-none" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.018)" }}>
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-10" style={{ background: "linear-gradient(90deg, #030B14 0%, transparent 100%)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-10" style={{ background: "linear-gradient(270deg, #030B14 0%, transparent 100%)" }} />
        {/* Forward marquee */}
        <div className="flex py-4 nv-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i} className="flex items-center gap-3 flex-shrink-0 px-7">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.dot }} />
              <span className="text-white/40 whitespace-nowrap font-medium" style={{ fontSize: "0.82rem" }}>{item.text}</span>
              <span className="text-white/12 ml-2">✦</span>
            </div>
          ))}
        </div>
        {/* Reverse marquee */}
        <div className="flex pb-4 nv-marquee-track" style={{ animationDirection: "reverse", animationDuration: "35s" }}>
          {[...MARQUEE_ITEMS.slice(5), ...MARQUEE_ITEMS, ...MARQUEE_ITEMS.slice(0, 5)].map((item, i) => (
            <div key={i} className="flex items-center gap-3 flex-shrink-0 px-7">
              <div className="w-1 h-1 rounded-full" style={{ background: item.dot, opacity: 0.7 }} />
              <span className="text-white/22 whitespace-nowrap" style={{ fontSize: "0.74rem" }}>{item.text}</span>
              <span className="text-white/8 ml-2">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── BENTO FEATURES ───────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14">
            <p className="text-cyan-400 mb-3" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em" }}>
              {t("TÍNH NĂNG NỔI BẬT","PLATFORM FEATURES")}
            </p>
            <h2 className="text-white max-w-3xl mx-auto" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              <WordReveal text={t("Mọi thứ bạn cần,","Everything you need,")} />
              <br />
              <span style={{ background: "linear-gradient(110deg,#22d3ee,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                <WordReveal text={t("trong một nền tảng.","in one platform.")} />
              </span>
            </h2>
          </motion.div>

          {/* Bento grid — staggered variants */}
          <motion.div
            className="grid grid-cols-12 gap-4"
            variants={bentoContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}>

            {/* Card 1: AI Agents — large, col-span-7 */}
            <BentoAICard t={t} />

            {/* Card 2: Stats — col-span-5 */}
            <motion.div
              variants={bentoCardVariants}
              className="col-span-12 lg:col-span-5 rounded-3xl p-7 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(34,211,238,0.06) 100%)", border: "1px solid rgba(139,92,246,0.18)" }}>
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.2)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-mono" style={{ fontSize: "0.6rem", fontWeight: 700 }}>LIVE</span>
              </div>
              <p className="text-white/40 mb-1" style={{ fontSize: "0.75rem", fontWeight: 600 }}>{t("Nền tảng tính đến hôm nay","Platform stats today")}</p>
              <div className="grid grid-cols-2 gap-5 mt-4">
                <StatCounter target={12400} suffix="+" color="#22d3ee" label={t("Căn hộ","Listings")} />
                <StatCounter target={98}    suffix="%" color="#34d399" label={t("Hài lòng","Satisfaction")} />
                <StatCounter target={3200}  suffix="+" color="#a78bfa" label={t("GD/tháng","Txn/month")} />
                <div>
                  <p className="font-black" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", letterSpacing: "-0.04em", color: "#fbbf24" }}>1.2s</p>
                  <p className="text-white/38" style={{ fontSize: "0.75rem" }}>{t("Phản hồi AI","AI latency")}</p>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Smart Search */}
            <motion.div
              variants={bentoCardVariants}
              whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 28 } }}
              className="col-span-12 md:col-span-4 rounded-3xl p-6 relative overflow-hidden cursor-pointer nv-bento-card nv-inner-shimmer"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.18)" }}>
                <Search size={20} style={{ color: "#22d3ee" }} />
              </div>
              <h3 className="text-white font-bold mb-2" style={{ fontSize: "1.1rem" }}>{t("Tìm kiếm thông minh","Smart Search")}</h3>
              <p className="text-white/40" style={{ fontSize: "0.83rem", lineHeight: 1.65 }}>
                {t("Nhắn tin tự nhiên — AI Super Broker hiểu ngữ cảnh và lọc căn hộ phù hợp trong giây lát.","Chat naturally — AI Super Broker understands context and finds matching apartments in seconds.")}
              </p>
            </motion.div>

            {/* Card 4: VietQR */}
            <motion.div
              variants={bentoCardVariants}
              whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 28 } }}
              className="col-span-12 md:col-span-4 rounded-3xl p-6 relative overflow-hidden cursor-pointer nv-bento-card nv-inner-shimmer"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.18)" }}>
                <QrCode size={20} style={{ color: "#10b981" }} />
              </div>
              <h3 className="text-white font-bold mb-2" style={{ fontSize: "1.1rem" }}>{t("Thanh toán VietQR","VietQR Payments")}</h3>
              <p className="text-white/40" style={{ fontSize: "0.83rem", lineHeight: 1.65 }}>
                {t("Hóa đơn tự động xuất VietQR, gửi email, reconcile thanh toán và báo cáo dòng tiền real-time.","Auto-generate VietQR invoices, email, payment reconciliation and cash-flow reports in real-time.")}
              </p>
            </motion.div>

            {/* Card 5: E-Contract */}
            <motion.div
              variants={bentoCardVariants}
              whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 28 } }}
              className="col-span-12 md:col-span-4 rounded-3xl p-6 relative overflow-hidden cursor-pointer nv-bento-card nv-inner-shimmer"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.18)" }}>
                <FileText size={20} style={{ color: "#a78bfa" }} />
              </div>
              <h3 className="text-white font-bold mb-2" style={{ fontSize: "1.1rem" }}>{t("Hợp đồng điện tử","E-Contracts")}</h3>
              <p className="text-white/40" style={{ fontSize: "0.83rem", lineHeight: 1.65 }}>
                {t("Ký số trực tuyến, lưu trữ an toàn, nhắc gia hạn tự động. Không cần in ấn, không cần gặp mặt.","Online e-signing, secure storage, auto renewal reminders. No printing, no in-person required.")}
              </p>
            </motion.div>

            {/* Card 6: Security — full width */}
            <motion.div
              variants={bentoCardVariants}
              className="col-span-12 rounded-3xl px-8 py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)" }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <Shield size={22} style={{ color: "#ef4444" }} />
                </div>
                <div>
                  <h3 className="text-white font-bold" style={{ fontSize: "1.05rem" }}>{t("Bảo mật cấp doanh nghiệp","Enterprise-grade security")}</h3>
                  <p className="text-white/38" style={{ fontSize: "0.82rem" }}>
                    {t("TLS 1.3 · OWASP Top 10 · WAF · Zero-Trust · AES-256 · SIEM 24/7","TLS 1.3 · OWASP Top 10 · WAF · Zero-Trust · AES-256 · SIEM 24/7")}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["A+ SSL","OWASP","AES-256","Zero-Trust","24/7"].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-full font-semibold" style={{ fontSize: "0.72rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>{tag}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ────────────────────────────────────── */}
      <section ref={listingsRef} className="py-20 px-6 border-t border-white/5" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.18)" }}>
                <Home size={12} className="text-emerald-400" />
                <span className="text-emerald-400" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em" }}>{t("DÀNH CHO KHÁCH THUÊ","FOR TENANTS")}</span>
              </div>
              <h2 className="text-white" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
                {t("Căn hộ đang còn phòng","Available apartments")}
              </h2>
              <p className="text-white/35 mt-1" style={{ fontSize: "0.85rem" }}>
                {t("Kiểm duyệt bởi AI — cập nhật thời gian thực","AI-verified listings — updated in real-time")}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <button onClick={() => setShowGetStarted(true)} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors" style={{ fontSize: "0.875rem" }}>
                {t("Xem tất cả","View all")}<ArrowRight size={15} />
              </button>
              <SocialProofBadge t={t} />
            </div>
          </motion.div>

          <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            <motion.div className="flex gap-5" style={{ minWidth: "max-content", x: listingsDrift }}>
              {LISTINGS.map((apt, i) => {
                const isCompared = selectedListings.includes(apt.id);
                const tickerMsgs = [`${apt.available} trống`, `${2 + (i % 4)} đang xem`, "Vừa được quan tâm", `${apt.available} phòng còn`];
                const tickerIdx = Math.floor(Date.now() / 4000 + i) % tickerMsgs.length;
                return (
                  <motion.div key={apt.id}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(i,3) * 0.08 }}
                    whileHover={{ y: -10, scale: 1.015 }}
                    onClick={() => setShowGetStarted(true)}
                    className="rounded-3xl overflow-hidden cursor-pointer flex-shrink-0 group relative"
                    style={{ width: "280px", background: isCompared ? `${apt.badgeHex}0d` : "rgba(255,255,255,0.04)", border: `1px solid ${isCompared ? apt.badgeHex + "50" : "rgba(255,255,255,0.09)"}`, boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${apt.badgeHex}60`; if (!isCompared) (e.currentTarget as HTMLElement).style.borderColor = `${apt.badgeHex}44`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.25)"; if (!isCompared) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)"; }}
                  >
                    {/* Compare toggle button */}
                    <button
                      onClick={e => { e.stopPropagation(); toggleCompare(apt.id); }}
                      className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                      style={{
                        background: isCompared ? apt.badgeHex : "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(8px)",
                        border: `1px solid ${isCompared ? apt.badgeHex : "rgba(255,255,255,0.2)"}`,
                        boxShadow: isCompared ? `0 0 12px ${apt.badgeHex}80` : "none",
                      }}>
                      <span className="text-white font-bold" style={{ fontSize: "0.85rem", lineHeight: 1 }}>{isCompared ? "✓" : "+"}</span>
                    </button>

                    <div className="relative h-48 overflow-hidden">
                      <LazyImage src={apt.img} alt={apt.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-white" style={{ fontSize: "0.6rem", fontWeight: 700, background: apt.badgeHex, boxShadow: `0 0 10px ${apt.badgeHex}80` }}>{apt.badge}</span>
                      {/* Real-time ticker */}
                      <div className="absolute top-12 right-3 rounded-full px-2 py-1 flex items-center gap-1" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white" style={{ fontSize: "0.58rem", fontWeight: 600 }}>{tickerMsgs[tickerIdx]}</span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold" style={{ fontSize: "0.9rem" }}>{apt.name}</h3>
                        <p className="text-white/60 flex items-center gap-1" style={{ fontSize: "0.7rem" }}><MapPin size={9} />{apt.district}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-cyan-400 font-bold" style={{ fontSize: "1.05rem" }}>{apt.priceFrom}M</span>
                        <span className="text-white/20 text-xs">–</span>
                        <span className="text-cyan-400 font-bold" style={{ fontSize: "1.05rem" }}>{apt.priceTo}M</span>
                        <span className="text-white/30" style={{ fontSize: "0.68rem" }}>/tháng</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {apt.amenities.map(a => (
                          <span key={a} className="text-white/50 px-2 py-0.5 rounded-md"
                            style={{ fontSize: "0.6rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>{a}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center gap-1">
                          <Star size={11} className="text-yellow-400" style={{ fill: "#facc15" }} />
                          <span className="text-white/50" style={{ fontSize: "0.72rem" }}>{apt.rating}</span>
                        </div>
                        <span className="text-white/28" style={{ fontSize: "0.68rem" }}>{apt.area}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowGetStarted(true)}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white hover:opacity-90 transition-opacity"
              style={{ fontSize: "0.9rem", background: "linear-gradient(135deg,#34d399,#22d3ee)", boxShadow: "0 0 24px rgba(52,211,153,0.2)" }}>
              {t("Đăng ký vào hệ thống","Create an account")}<ArrowRight size={16} />
            </motion.button>
            <button onClick={() => setShowGetStarted(true)} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors" style={{ fontSize: "0.875rem" }}>
              {t("Duyệt tất cả","Browse all")}<ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── AI CONTROL ROOM ──────────────────────────────────────── */}
      <section className="py-24 px-6">
        <AgentControlRoom />
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section ref={howRef} className="py-20 px-6 border-t border-white/5" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16">
            <p className="text-violet-400 mb-3" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em" }}>
              {t("QUY TRÌNH 3 BƯỚC","3 SIMPLE STEPS")}
            </p>
            <h2 className="text-white" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
              <WordReveal text={t("Đơn giản từ đầu đến cuối","Simple from start to finish")} />
            </h2>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Scroll-driven connector line */}
            <motion.div
              className="nv-step-connector hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px pointer-events-none"
              style={{ scaleX: connectorScale, originX: 0 }}
            />

            {([
              { step: "01", title: t("Mô tả nhu cầu","Describe your needs"), desc: t("Nhắn tin cho AI Super Broker như nói chuyện bình thường — AI hiểu ngữ cảnh, lọc chính xác.","Chat with AI Super Broker naturally — it understands context and filters precisely."), icon: MessageSquare, color: "#22d3ee", entrance: { x: -40, y: 0 } },
              { step: "02", title: t("Xem & Đặt lịch","View & Schedule"), desc: t("Nhận đề xuất cá nhân hóa, xem virtual tour hoặc đặt lịch thực tế ngay trong app.","Get personalized suggestions, virtual tours or schedule in-person visits in the app."), icon: Home, color: "#34d399", entrance: { x: 0, y: 40 } },
              { step: "03", title: t("Ký HĐ & Quản lý","Sign & Manage"), desc: t("Ký hợp đồng điện tử, thanh toán VietQR, theo dõi sự cố và hóa đơn mọi lúc.","Sign e-contracts, pay via VietQR, track maintenance and invoices anytime."), icon: FileText, color: "#a78bfa", entrance: { x: 40, y: 0 } },
            ] as const).map((h, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, ...h.entrance }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 140, damping: 20 }}
                whileHover={{ y: -4 }}
                className="relative rounded-3xl p-7 border transition-all"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${h.color}30`; (e.currentTarget as HTMLElement).style.background = `${h.color}06`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${h.color}15`, border: `1px solid ${h.color}22` }}>
                    <h.icon size={22} style={{ color: h.color }} />
                  </div>
                  <span className="font-black" style={{ fontSize: "3.5rem", lineHeight: 1, color: `${h.color}10`, letterSpacing: "-0.05em" }}>{h.step}</span>
                </div>
                <h3 className="text-white mb-2" style={{ fontSize: "1.1rem", fontWeight: 700 }}>{h.title}</h3>
                <p className="text-white/40" style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY GRID ─────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}>
              <Shield size={13} className="text-red-400" />
              <span className="text-red-400" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>WEB SECURITY</span>
            </div>
            <h2 className="text-white mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
              <WordReveal text={t("Bảo mật cấp doanh nghiệp","Enterprise-grade security")} />
            </h2>
            <p className="text-white/38 max-w-xl mx-auto" style={{ fontSize: "0.9rem", lineHeight: 1.75 }}>
              {t("Kiểm thử xâm nhập định kỳ, tuân thủ OWASP Top 10. Dữ liệu người dùng bảo vệ đa lớp.","Regular penetration testing, OWASP Top 10 compliance. Multi-layered user data protection.")}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
            variants={securityContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}>
            {SECURITY_FEATURES.map((f, i) => (
              <motion.div key={i} variants={securityCardVariants}
                whileHover={{ y: -3 }}
                className="rounded-2xl p-5 border transition-all cursor-default"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${f.color}30`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${f.color}14` }}>
                    <f.icon size={20} style={{ color: f.color }} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full font-semibold" style={{ fontSize: "0.62rem", background: `${f.color}18`, color: f.color }}>{f.tag}</span>
                </div>
                <h3 className="text-white mb-1.5" style={{ fontSize: "0.95rem", fontWeight: 700 }}>{f.title}</h3>
                <p className="text-white/38" style={{ fontSize: "0.8rem", lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* OWASP badge */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4"
            style={{ background: "rgba(52,211,153,0.04)", borderColor: "rgba(52,211,153,0.15)" }}>
            <div>
              <p className="text-white font-bold" style={{ fontSize: "0.95rem" }}>OWASP Top 10 — 2021 Compliance</p>
              <p className="text-white/38 mt-0.5" style={{ fontSize: "0.78rem" }}>{t("Toàn bộ 10 lỗ hổng phổ biến nhất đều được xử lý và vá định kỳ","All 10 most critical vulnerabilities addressed and patched regularly")}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.22)" }}>
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold" style={{ fontSize: "0.78rem" }}>10/10 Covered</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RENTAL CALCULATOR ────────────────────────────────────── */}
      <RentalCalculator t={t} onGetStarted={() => setShowGetStarted(true)} />

      {/* ── APP DOWNLOAD ──────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl p-10 md:p-14 border flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="absolute -left-24 -top-16 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)" }} />
            <div className="absolute -right-24 -bottom-16 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />
            <div className="relative flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                <Smartphone size={12} className="text-cyan-400" />
                <span className="text-white/45" style={{ fontSize: "0.73rem" }}>iOS & Android</span>
              </div>
              <h2 className="text-white mb-3" style={{ fontSize: "clamp(1.5rem,2.5vw,2.2rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
                {t("Quản lý mọi thứ trong","Manage everything in the")}
                {" "}<span style={{ background: "linear-gradient(90deg,#22d3ee,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {t("lòng bàn tay","palm of your hand")}
                </span>
              </h2>
              <p className="text-white/38 mb-7 max-w-md mx-auto md:mx-0" style={{ fontSize: "0.9rem", lineHeight: 1.75 }}>
                {t("Đồng bộ hoàn toàn giữa web và app — nhận thông báo thanh toán, theo dõi bảo trì và xem hợp đồng mọi lúc.","Fully synced between web and app — get payment alerts, track maintenance and view contracts anywhere.")}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {[
                  { store: "App Store", icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg> },
                  { store: "Google Play", icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none"><path d="M3.18 23.4c.3.17.64.2.95.08l11.5-6.64-2.36-2.36L3.18 23.4zm15.14-8.74L5.69 7.91 3.18.6c-.3-.12-.64-.09-.95.08L13.23 11.7l5.09 2.96zm1.56-5.5L16.72 7.4l-2.93-1.7L2.23.57c-.43-.25-.95-.13-1.23.25v22.36c.28.38.8.5 1.23.25l11.55-6.67 2.93-1.7 3.16-1.83c.68-.4.68-1.4.01-1.79v.01z" fill="#34A853" /></svg> },
                ].map(({ store, icon }) => (
                  <button key={store} className="flex items-center gap-3 rounded-xl px-5 py-3 border border-white/9 hover:border-white/18 transition-all" style={{ background: "rgba(255,255,255,0.045)" }}>
                    <span className="text-white">{icon}</span>
                    <div className="text-left">
                      <p className="text-white/30" style={{ fontSize: "0.6rem" }}>Tải về trên</p>
                      <p className="text-white font-semibold" style={{ fontSize: "0.88rem" }}>{store}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {/* Phone mockup */}
            <div className="relative flex-shrink-0">
              <div className="w-48 h-80 rounded-[2.5rem] border-2 border-white/10 shadow-2xl overflow-hidden"
                style={{ background: "linear-gradient(160deg,#0d1629 0%,#030B14 100%)" }}>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-white/12" />
                <div className="absolute inset-0 pt-10 px-3">
                  <div className="h-3.5 w-3/4 rounded-md bg-white/7 mb-2" />
                  <div className="h-2.5 w-1/2 rounded-md bg-white/5 mb-4" />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {[["from-emerald-500 to-teal-500","45.2M ₫"],["from-violet-500 to-purple-500","92%"]].map(([g,v],i) => (
                      <div key={i} className={`rounded-xl bg-gradient-to-br ${g} p-2.5`}>
                        <p className="text-white font-bold" style={{ fontSize: "0.75rem" }}>{v}</p>
                        <p className="text-white/50" style={{ fontSize: "0.5rem" }}>Live</p>
                      </div>
                    ))}
                  </div>
                  {[0,1,2].map(i => (
                    <div key={i} className="h-7 rounded-lg bg-white/5 flex items-center px-2 gap-2 mb-1.5">
                      <div className="w-3.5 h-3.5 rounded bg-white/8 flex-shrink-0" />
                      <div className="flex-1 h-1.5 rounded bg-white/7" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full" style={{ background: "rgba(34,211,238,0.18)", filter: "blur(10px)" }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LISTING BOARD ─────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
              <Bot size={13} className="text-violet-400" />
              <span className="text-violet-400" style={{ fontSize: "0.72rem", fontWeight: 700 }}>{t("SÀN TÌM PHÒNG","LISTINGS BOARD")}</span>
            </div>
            <h2 className="text-white mb-4" style={{ fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
              {t("Tin đăng từ","Listings from")}{" "}
              <span style={{ background: "linear-gradient(90deg,#a78bfa,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {t("AI & cộng đồng","AI & community")}
              </span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto" style={{ fontSize: "0.92rem", lineHeight: 1.7 }}>
              {t("AI tự động đăng tin khi cư dân hủy hợp đồng. Quản lý và người dùng cũng có thể đăng tin tìm phòng.","AI auto-posts when tenants end contracts. Managers and users can also post room listings.")}
            </p>
          </motion.div>

          {(() => {
            const dynamic: { id: string; title: string; price: string; area: string; district: string; description: string; type: string; postedAt: string }[] = (() => {
              try { return JSON.parse(localStorage.getItem("nv-listings-board") || "[]"); } catch { return []; }
            })();
            const staticListings = [
              { id:"S01", title:"Phòng 1801 — Vinhomes Grand Park", price:"9.5M/tháng", area:"58m²", district:"TP. Thủ Đức", description:"2PN · 1WC · Nội thất cơ bản. Cần cho thuê gấp, chủ nhà chuyển công tác. View thoáng, tầng cao.", type:"landlord", postedAt:"28/04/2025" },
              { id:"S02", title:"AI tìm phòng: 2PN Q7 dưới 12M", price:"11M/tháng", area:"65m²", district:"Quận 7", description:"Super Broker AI đang tìm phòng cho cư dân có nhu cầu. Pet-friendly, gần trường quốc tế.", type:"ai", postedAt:"29/04/2025" },
              { id:"S03", title:"Studio mới bàn giao — Masteri Centre Point", price:"10.2M/tháng", area:"45m²", district:"TP. Thủ Đức", description:"Căn studio full nội thất cao cấp, view hồ bơi. Phù hợp 1–2 người. Ký HĐ điện tử qua NestaVietAI.", type:"landlord", postedAt:"27/04/2025" },
              { id:"S04", title:"Tìm bạn ở ghép — Sunwah Pearl", price:"7M/người/tháng", area:"80m²", district:"Bình Thạnh", description:"Phòng 3PN cần thêm 1 người ở ghép. View sông Sài Gòn, đủ tiện nghi.", type:"user", postedAt:"26/04/2025" },
              { id:"S05", title:"Phòng vừa trả lại — Sunrise City North", price:"11.5M/tháng", area:"65m²", district:"Quận 7", description:"Phòng 1204 vừa hết hợp đồng. AI đã xác minh thông tin và đang tìm cư dân mới.", type:"ai", postedAt:"29/04/2025" },
            ];
            const all = [...dynamic, ...staticListings].slice(0, 6);
            const typeConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
              ai:       { label: "🤖 AI Đăng",   color: "#c084fc", bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.22)" },
              landlord: { label: "🏢 Quản lý",   color: "#60a5fa", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.22)"  },
              user:     { label: "👤 Cư dân",    color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.22)"  },
            };
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
                {all.map((listing, i) => {
                  const tc = typeConfig[listing.type] || typeConfig.user;
                  return (
                    <motion.div key={listing.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                      whileHover={{ y: -4 }}
                      className="rounded-2xl p-5 cursor-pointer transition-all"
                      style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = tc.border; (e.currentTarget as HTMLElement).style.background = tc.bg; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.035)"; }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold border" style={{ fontSize: "0.65rem", color: tc.color, background: tc.bg, borderColor: tc.border }}>{tc.label}</span>
                        <span className="text-white/28" style={{ fontSize: "0.65rem" }}>{listing.postedAt}</span>
                      </div>
                      <h3 className="text-white font-bold mb-2" style={{ fontSize: "0.92rem", lineHeight: 1.4 }}>{listing.title}</h3>
                      <p className="text-white/40 mb-4" style={{ fontSize: "0.78rem", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{listing.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-emerald-400 font-bold" style={{ fontSize: "0.95rem" }}>{listing.price}</p>
                          <p className="text-white/30" style={{ fontSize: "0.68rem" }}>{listing.area} · {listing.district}</p>
                        </div>
                        <button onClick={e => { e.stopPropagation(); setContactListing(listing); }}
                          className="px-3 py-1.5 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                          style={{ fontSize: "0.72rem", background: "linear-gradient(135deg,#a78bfa,#22d3ee)" }}>
                          {t("Liên hệ","Contact")}
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-violet-500/28 text-violet-400 hover:text-white hover:border-violet-500 hover:bg-violet-500/10 transition-all"
              style={{ fontSize: "0.875rem", fontWeight: 600 }}>
              <Bot size={15} />{t("Đăng tin tìm phòng với AI","Post a room search with AI")}<ArrowRight size={14} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── NEIGHBORHOOD HEATMAP ─────────────────────────────────── */}
      <NeighborhoodHeatmap t={t} />

      {/* ── MARKET INSIGHTS ──────────────────────────────────────── */}
      <MarketInsights t={t} />

      {/* ── CTA BAND ─────────────────────────────────────────────── */}
      <section ref={ctaRef} className="py-24 px-6 border-t border-white/5 relative overflow-hidden">
        {/* Scroll-driven spotlight */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ x: ctaGlowX, inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(34,211,238,0.06) 0%, transparent 70%)" }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/50" style={{ fontSize: "0.75rem" }}>{t("Miễn phí đăng ký — không cần thẻ tín dụng","Free to join — no credit card needed")}</span>
            </div>
            <h2 className="text-white mb-5" style={{ fontSize: "clamp(2rem,5vw,3.8rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05 }}>
              <WordReveal text={t("Bắt đầu ngay hôm nay","Start today,")} /><br />
              <span style={{ background: "linear-gradient(110deg,#34d399 0%,#22d3ee 50%,#818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                <WordReveal text={t("hoàn toàn miễn phí","completely free.")} />
              </span>
            </h2>
            <p className="text-white/38 mb-10 max-w-lg mx-auto" style={{ fontSize: "1rem", lineHeight: 1.75 }}>
              {t("Kết hợp với AI Super Broker để chuẩn hoá thông tin căn hộ nơi bạn ở. Quản lý mọi thứ từ một nơi.","Combine with AI Super Broker to standardize your apartment info. Manage everything from one place.")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 44px rgba(34,211,238,0.38)" }}
                whileTap={{ scale: 0.97 }}
                animate={{ boxShadow: ["0 0 30px rgba(34,211,238,0.22)", "0 0 60px rgba(34,211,238,0.45)", "0 0 30px rgba(34,211,238,0.22)"] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                onClick={() => setShowGetStarted(true)}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white"
                style={{ fontSize: "0.95rem", background: "linear-gradient(135deg,#22d3ee,#3b82f6)" }}>
                {t("Bắt đầu ngay — miễn phí","Get started — free")}<ArrowRight size={17} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowGetStarted(true)}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white/60 border border-white/12 hover:text-white/85 hover:border-white/22 transition-all"
                style={{ fontSize: "0.95rem" }}>
                <Building2 size={16} />{t("Đăng ký quản lý tòa nhà","Register building manager")}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 pt-14 pb-8 px-6" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center" style={{ boxShadow: "0 0 12px rgba(34,211,238,0.25)" }}>
                  <Building2 size={14} className="text-white" />
                </div>
                <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  NestaViet<span className="text-cyan-400">AI</span>
                </span>
              </div>
              <p className="text-white/30 mb-5" style={{ fontSize: "0.82rem", lineHeight: 1.75, maxWidth: "260px" }}>
                {t("Nền tảng PropTech thế hệ mới — Multi-Agent AI tự trị cho thị trường bất động sản cho thuê Việt Nam.","Next-gen PropTech platform — autonomous Multi-Agent AI for Vietnam's rental market.")}
              </p>
              <div className="space-y-1">
                <p className="text-emerald-500/40 font-mono" style={{ fontSize: "0.65rem" }}>tenant.nestaviet.vn</p>
                <p className="text-violet-500/40 font-mono" style={{ fontSize: "0.65rem" }}>manager.nestaviet.vn</p>
              </div>
            </div>
            {[
              { title: t("Sản phẩm","Product"), links: [
                { label: t("Tìm căn hộ","Find apartments"),   href: "/tenant",    action: null                         },
                { label: "AI Chatbot",                          href: "/tenant",    action: null                         },
                { label: t("Hợp đồng điện tử","E-Contracts"),  href: "/contracts", action: null                         },
                { label: t("Thanh toán","Payments"),            href: "/payments",  action: null                         },
              ]},
              { title: t("Công ty","Company"), links: [
                { label: t("Về chúng tôi","About"),          href: null, action: "modal" },
                { label: "Blog",                              href: null, action: "modal" },
                { label: t("Tuyển dụng","Careers"),          href: null, action: "modal" },
                { label: t("Đối tác","Partners"),             href: null, action: "modal" },
              ]},
              { title: t("Hỗ trợ","Support"), links: [
                { label: t("Trợ giúp","Help center"),         href: null,         action: "modal"  },
                { label: t("Liên hệ","Contact"),              href: null,         action: "modal"  },
                { label: t("Bảo mật","Security"),             href: "/security",  action: null     },
                { label: t("Chính sách","Privacy policy"),    href: null,         action: "modal"  },
              ]},
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-white/55 font-semibold mb-4" style={{ fontSize: "0.85rem" }}>{title}</p>
                <div className="space-y-3">
                  {links.map(({ label, href, action }) => (
                    <button key={label} onClick={() => {
                      if (href) navigate(href);
                      else if (action === "modal") setShowGetStarted(true);
                    }}
                      className="block text-white/30 hover:text-white/65 transition-colors text-left"
                      style={{ fontSize: "0.82rem" }}>{label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
            <p className="text-white/22" style={{ fontSize: "0.75rem" }}>
              © 2025 NestaVietAI. {t("Tất cả quyền được bảo lưu.","All rights reserved.")}
            </p>
            <div className="flex items-center gap-4">
              {[
                { label: t("Điều khoản","Terms"), href: null },
                { label: t("Bảo mật","Privacy"), href: null },
                { label: t("Cookie","Cookies"),  href: null },
              ].map(({ label }) => (
                <button key={label} className="text-white/22 hover:text-white/50 transition-colors" style={{ fontSize: "0.75rem" }}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
