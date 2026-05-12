import type { RefObject } from "react";
import { motion } from "motion/react";
import type { MotionValue } from "motion/react";
import { Star, MapPin, ArrowRight, ChevronRight, Home } from "lucide-react";
import { LazyImage } from "@shared/components/LazyImage";
import { SocialProofBadge } from "../components";
import { REAL_LISTINGS, FEATURED_REAL } from "../data";

type FeaturedListing = typeof FEATURED_REAL[number];

interface ListingsSectionProps {
  listingsRef: RefObject<HTMLElement | null>;
  listingsDrift: MotionValue<number>;
  listingFilter: "all" | "hcm" | "hn" | "other";
  setListingFilter: (f: "all" | "hcm" | "hn" | "other") => void;
  selectedListings: number[];
  toggleCompare: (id: number) => void;
  onContactListing: (apt: FeaturedListing) => void;
  onGetStarted: () => void;
  t: (vi: string, en: string) => string;
}

export default function ListingsSection({
  listingsRef, listingsDrift, listingFilter, setListingFilter,
  selectedListings, toggleCompare, onContactListing, onGetStarted, t,
}: ListingsSectionProps) {
  return (
    <section ref={listingsRef} className="py-28 px-6" style={{ background: "rgba(255,255,255,0.015)" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.18)" }}>
              <Home size={12} className="text-emerald-400" />
              <span className="text-emerald-400" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em" }}>{t("TIN THUÊ NHÀ THỰC TẾ","REAL RENTAL LISTINGS")}</span>
            </div>
            <h2 className="text-white" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
              {t("Tin thuê nhà thực tế","Live rental listings")}
            </h2>
            <p className="text-white/35 mt-1" style={{ fontSize: "0.85rem" }}>
              {t(`${REAL_LISTINGS.length} căn hộ & phòng trọ thực tế · nhiều tỉnh thành`,`${REAL_LISTINGS.length} real rentals · multiple cities`)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button onClick={onGetStarted} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors" style={{ fontSize: "0.875rem" }}>
              {t("Xem tất cả","View all")}<ArrowRight size={15} />
            </button>
            <SocialProofBadge t={t} />
          </div>
        </motion.div>

        {/* Province filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {([
            { key: "all",   label: t("Tất cả","All"),       count: FEATURED_REAL.length },
            { key: "hcm",   label: "TP. Hồ Chí Minh",       count: FEATURED_REAL.filter(l => l.province.includes("Hồ Chí Minh")).length },
            { key: "hn",    label: "Hà Nội",                 count: FEATURED_REAL.filter(l => l.province.includes("Hà Nội")).length },
            { key: "other", label: t("Tỉnh khác","Other"),   count: FEATURED_REAL.filter(l => !l.province.includes("Hồ Chí Minh") && !l.province.includes("Hà Nội")).length },
          ] as { key: "all"|"hcm"|"hn"|"other"; label: string; count: number }[]).map(tab => (
            <button key={tab.key} onClick={() => setListingFilter(tab.key)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all"
              style={{
                fontSize: "0.75rem", fontWeight: 600,
                background: listingFilter === tab.key ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.04)",
                borderColor: listingFilter === tab.key ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.1)",
                color: listingFilter === tab.key ? "#22d3ee" : "rgba(255,255,255,0.45)",
              }}>
              {tab.label}
              <span className="px-1.5 py-0.5 rounded-full text-white/40"
                style={{ fontSize: "0.6rem", background: "rgba(255,255,255,0.08)" }}>{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          <motion.div className="flex gap-5" style={{ minWidth: "max-content", x: listingsDrift }}>
            {FEATURED_REAL
              .filter(apt =>
                listingFilter === "all"   ? true :
                listingFilter === "hcm"   ? apt.province.includes("Hồ Chí Minh") :
                listingFilter === "hn"    ? apt.province.includes("Hà Nội") :
                !apt.province.includes("Hồ Chí Minh") && !apt.province.includes("Hà Nội")
              )
              .map((apt, i) => {
              const isCompared = selectedListings.includes(apt.id);
              const tickerMsgs = [`${apt.available} trống`, `${2 + (i % 4)} đang xem`, "Vừa được quan tâm", `${apt.available} phòng còn`];
              const tickerIdx = Math.floor(Date.now() / 4000 + i) % tickerMsgs.length;
              return (
                <motion.div key={apt.id}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(i,3) * 0.08 }}
                  whileHover={{ y: -10, scale: 1.015 }}
                  onClick={() => onContactListing(apt)}
                  className="rounded-3xl overflow-hidden cursor-pointer flex-shrink-0 group relative"
                  style={{ width: "280px", background: isCompared ? `${apt.badgeHex}0d` : "rgba(255,255,255,0.04)", border: `1px solid ${isCompared ? apt.badgeHex + "50" : "rgba(255,255,255,0.09)"}`, boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${apt.badgeHex}60`; if (!isCompared) (e.currentTarget as HTMLElement).style.borderColor = `${apt.badgeHex}44`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.25)"; if (!isCompared) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)"; }}
                >
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
                      <div className="flex items-center gap-2">
                        <span className="text-white/28" style={{ fontSize: "0.65rem" }}>{apt.area}</span>
                        {"sourceUrl" in apt && (apt as { sourceUrl?: string }).sourceUrl && (
                          <a
                            href={(apt as { sourceUrl?: string }).sourceUrl}
                            target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="px-1.5 py-0.5 rounded text-white/30 hover:text-cyan-400 transition-colors"
                            style={{ fontSize: "0.55rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            Xem chi tiết ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-10">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onGetStarted}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white hover:opacity-90 transition-opacity"
            style={{ fontSize: "0.9rem", background: "linear-gradient(135deg,#34d399,#22d3ee)", boxShadow: "0 0 24px rgba(52,211,153,0.2)" }}>
            {t("Đăng ký vào hệ thống","Create an account")}<ArrowRight size={16} />
          </motion.button>
          <button onClick={onGetStarted} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors" style={{ fontSize: "0.875rem" }}>
            {t("Duyệt tất cả","Browse all")}<ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
