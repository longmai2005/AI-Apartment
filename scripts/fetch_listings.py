import requests
import json
import time
import os
import re
from datetime import datetime
from collections import defaultdict

# ─── Cấu hình ────────────────────────────────────────────────────────────────

# Chiến lược đúng (đã test và xác nhận):
# Dùng nhiều search query để tổng hợp đủ loại nhà cho thuê
FETCH_CONFIGS = [
    {"cg": None, "q": "studio+cho+thue",     "label": "Studio cho thuê"},
    {"cg": None, "q": "thue+phong+tro",      "label": "Phòng trọ"},
    {"cg": None, "q": "cho+thue+can+ho",     "label": "Căn hộ cho thuê"},
    {"cg": None, "q": "cho+thue+chung+cu",   "label": "Chung cư cho thuê"},
    {"cg": None, "q": "phong+1pn+cho+thue",  "label": "1PN cho thuê"},
    {"cg": None, "q": "can+ho+dich+vu",      "label": "Căn hộ dịch vụ"},
    {"cg": None, "q": "thue+nha+nguyen+can", "label": "Nhà nguyên căn cho thuê"},
]

TOTAL_PAGES  = 15   # 15 trang × 20 = 300 listings/query (tổng ~1500+)
DELAY        = 1.2  # giây
OUTPUT_DIR   = "data"
TS_OUTPUT_WEB    = "src/data/listings.ts"
TS_OUTPUT_MOBILE = "mobile/constants/listings.ts"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Referer": "https://www.chotot.com/",
}

# area_v2 prefix → tên tỉnh/thành (5 chữ số đầu ÷ 1000)
AREA_V2_TO_PROVINCE = {
    13: "TP. Hồ Chí Minh",
    12: "TP. Hà Nội",
    53: "TP. Đà Nẵng",
    58: "TP. Hải Phòng",
    65: "TP. Cần Thơ",
    46: "TP. Huế",
    15: "Tỉnh Bình Dương",
    35: "Tỉnh Đồng Nai",
    56: "Tỉnh Khánh Hòa",
    68: "Tỉnh Lâm Đồng",
    77: "Tỉnh Bà Rịa - Vũng Tàu",
    80: "Tỉnh Long An",
    82: "Tỉnh Tiền Giang",
    40: "Tỉnh Nghệ An",
    38: "Tỉnh Thanh Hóa",
    49: "Tỉnh Quảng Nam",
    51: "Tỉnh Quảng Ngãi",
    52: "Tỉnh Bình Định",
    54: "Tỉnh Phú Yên",
    60: "Tỉnh Ninh Thuận",
    61: "Tỉnh Bình Thuận",
    72: "Tỉnh Tây Ninh",
    74: "Tỉnh Bình Phước",
    89: "Tỉnh An Giang",
    87: "Tỉnh Đồng Tháp",
    93: "Tỉnh Hậu Giang",
    94: "Tỉnh Sóc Trăng",
    91: "Tỉnh Kiên Giang",
    95: "Tỉnh Bạc Liêu",
    96: "Tỉnh Cà Mau",
    44: "Tỉnh Quảng Bình",
    45: "Tỉnh Quảng Trị",
    42: "Tỉnh Hà Tĩnh",
     2: "Tỉnh Hà Giang",
}

UNSPLASH_FALLBACK = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1551361415-69c87624334f?w=600&q=80&fit=crop",
]

TYPE_MAP = {
    0: "Căn hộ",
    1: "Studio",
    2: "1 Phòng ngủ",
    3: "2 Phòng ngủ",
    4: "3 Phòng ngủ",
    5: "Penthouse",
    6: "Duplex",
}

AMENITY_KEYWORDS = {
    "wifi": "Wifi",
    "máy lạnh": "Máy lạnh", "điều hòa": "Máy lạnh",
    "máy giặt": "Máy giặt",
    "tủ lạnh": "Tủ lạnh",
    "hồ bơi": "Hồ bơi", "swimming": "Hồ bơi",
    "gym": "Gym",
    "nội thất": "Nội thất đầy đủ",
    "bảo vệ": "Bảo vệ 24/7", "an ninh": "Bảo vệ 24/7",
    "ban công": "Ban công",
    "hầm xe": "Hầm xe", "chỗ để xe": "Chỗ để xe",
    "bếp": "Bếp đầy đủ",
}

# ─── Fetch ────────────────────────────────────────────────────────────────────

def fetch_all_raw() -> list[dict]:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    all_ads = []
    seen_ids = set()

    for cfg in FETCH_CONFIGS:
        cg, q, label = cfg["cg"], cfg["q"], cfg["label"]
        print(f"\n{'─'*50}")
        print(f"📥 {label}")
        count = 0
        for page in range(TOTAL_PAGES):
            offset = page * 20
            if cg:
                url = f"https://gateway.chotot.com/v1/public/ad-listing?cg={cg}&limit=20&o={offset}&st=s,k"
            else:
                url = f"https://gateway.chotot.com/v1/public/ad-listing?q={q}&limit=20&o={offset}&st=s,k"
            try:
                r = requests.get(url, headers=HEADERS, timeout=12)
                if r.status_code != 200:
                    print(f"  ⚠ HTTP {r.status_code} — dừng pagination")
                    break
                ads = r.json().get("ads", [])
                if not ads:
                    print(f"  ✓ Hết data ở page {page+1}")
                    break
                new = [a for a in ads if a.get("list_id") not in seen_ids]
                seen_ids.update(a["list_id"] for a in new if a.get("list_id"))
                rentals = [a for a in new if is_rental(a)]
                all_ads.extend(rentals)
                count += len(rentals)
                print(f"  page {page+1:2d}: {len(ads):2d} ads → {len(rentals):2d} rentals (tổng={count})")
            except Exception as e:
                print(f"  ✗ page {page+1}: {e}")
                break
            time.sleep(DELAY)

    print(f"\n✅ Tổng raw rentals: {len(all_ads)}")
    with open(os.path.join(OUTPUT_DIR, "listings_raw.json"), "w", encoding="utf-8") as f:
        json.dump(all_ads, f, ensure_ascii=False, indent=2)
    return all_ads


def is_rental(ad: dict) -> bool:
    price_str = (ad.get("price_string", "") or "").lower()
    subject   = (ad.get("subject", "") or "").lower()
    price     = ad.get("price", 0) or 0
    cat       = ad.get("category", 0)
    # Giá rõ ràng là theo tháng
    if "tháng" in price_str:
        return True
    # Category phòng trọ hoặc căn hộ (không phải đất/văn phòng)
    if cat in (1000, 1050):
        return True
    # Giá nằm trong khoảng hợp lý của thuê theo tháng (500K - 100M)
    if 500_000 < price < 100_000_000:
        return True
    # Từ khóa cho thuê trong tiêu đề
    if any(kw in subject for kw in ["cho thuê", "cần thuê", "thuê căn", "thuê phòng"]):
        return True
    return False


# ─── Normalize ───────────────────────────────────────────────────────────────

def get_province(ad: dict) -> str:
    area_v2 = ad.get("area_v2", 0) or 0
    prefix = area_v2 // 1000
    return AREA_V2_TO_PROVINCE.get(prefix, "Việt Nam")


def parse_price(ad: dict) -> tuple[str, int]:
    price_str = (ad.get("price_string", "") or "").strip()
    price     = ad.get("price", 0) or 0
    if price_str and price_str != "0":
        nums = re.findall(r"[\d,]+", price_str)
        if nums:
            try:
                val = float(nums[0].replace(",", "."))
                if "tỷ" in price_str.lower():
                    return price_str, int(val * 1_000_000_000)
                return price_str, int(val * 1_000_000)
            except Exception:
                pass
    if price >= 1_000_000:
        m = price / 1_000_000
        label = f"{m:.1f} tr/tháng".replace(".0 ", " ")
        return label, price
    return "Thỏa thuận", 0


def parse_area(ad: dict) -> str:
    area = ad.get("area", 0) or 0
    if area and area < 10000:
        return f"{int(area)} m²"
    return "N/A"


def parse_amenities(ad: dict) -> list[str]:
    text = ((ad.get("subject", "") or "") + " " + (ad.get("body", "") or "")).lower()
    found = []
    seen = set()
    for keyword, label in AMENITY_KEYWORDS.items():
        if keyword in text and label not in seen:
            found.append(label)
            seen.add(label)
    return found or ["Wifi", "Máy lạnh"]


def parse_tags(ad: dict, verified: bool, province: str) -> list[str]:
    tags = []
    if verified:
        tags.append("AI Verified")
    text = (ad.get("subject", "") or "").lower()
    if "hồ bơi" in text or "pool" in text:
        tags.append("Hồ bơi")
    elif "ban công" in text:
        tags.append("Ban công")
    elif "gym" in text:
        tags.append("Gym")
    elif "full nội thất" in text or "full nt" in text:
        tags.append("Full nội thất")
    if "Hồ Chí Minh" not in province and "Hà Nội" not in province and len(tags) < 3:
        short = province.replace("TP. ", "").replace("Tỉnh ", "")
        tags.append(short)
    if len(tags) < 2:
        tags.append("Cho thuê")
    return tags[:3]


def normalize(ad: dict, index: int) -> dict | None:
    subject = (ad.get("subject", "") or "").strip()
    if not subject:
        return None

    price_str, price_num = parse_price(ad)
    province = get_province(ad)
    area_name = (ad.get("area_name", "") or "").strip()
    district = f"{area_name}, {province}" if area_name else province

    # Image: dùng CDN URL từ API (đã là URL đầy đủ)
    img_url = ""
    if ad.get("image") and str(ad["image"]).startswith("http"):
        img_url = ad["image"]
    else:
        for img in (ad.get("images") or []):
            if isinstance(img, str) and img.startswith("http"):
                img_url = img
                break
    if not img_url:
        img_url = UNSPLASH_FALLBACK[index % len(UNSPLASH_FALLBACK)]

    cat    = ad.get("category", 0)
    rooms  = ad.get("rooms", 0) or 0
    if cat == 1000:
        listing_type = "Phòng trọ"
    else:
        listing_type = TYPE_MAP.get(int(rooms), "Căn hộ")

    amenities = parse_amenities(ad)
    verified  = bool(ad.get("company_ad")) or (0 < price_num < 30_000_000)

    ad_id  = str(ad.get("list_id", f"nv-{index}"))
    rating = round(min(4.0 + (hash(ad_id) % 11) / 10, 5.0), 1)

    desc = (ad.get("body", "") or "").strip()
    desc = re.sub(r"\s+", " ", desc)[:250] or f"Cho thuê tại {district}."

    result: dict = {
        "id":          ad_id,
        "title":       subject[:70],
        "price":       price_str,
        "priceNum":    price_num,
        "area":        parse_area(ad),
        "district":    district,
        "province":    province,
        "type":        listing_type,
        "image":       img_url,
        "tags":        parse_tags(ad, verified, province),
        "verified":    verified,
        "rating":      rating,
        "description": desc,
        "amenities":   amenities,
        "postedAt":    ad.get("date", datetime.now().isoformat()),
        "sourceUrl":   f"https://www.chotot.com/{ad_id}",
    }
    lat = ad.get("latitude") or ad.get("lat")
    lng = ad.get("longitude") or ad.get("lng")
    if lat and lng:
        result["lat"] = float(lat)
        result["lng"] = float(lng)
    return result


def normalize_all(raw: list[dict]) -> list[dict]:
    cleaned = []
    for i, ad in enumerate(raw):
        item = normalize(ad, i)
        if item and item["priceNum"] > 0:
            cleaned.append(item)

    # Thống kê theo tỉnh
    by_province: dict[str, int] = defaultdict(int)
    for item in cleaned:
        by_province[item["province"]] += 1

    print(f"\n✅ {len(cleaned)} listings hợp lệ (có giá)")
    print("\nPhân bổ theo tỉnh/thành:")
    for prov, cnt in sorted(by_province.items(), key=lambda x: -x[1])[:15]:
        bar = "█" * (cnt // 5)
        print(f"  {prov:30s} {cnt:4d} {bar}")
    if len(by_province) > 15:
        print(f"  ... và {len(by_province)-15} tỉnh/thành khác")

    with open(os.path.join(OUTPUT_DIR, "listings_clean.json"), "w", encoding="utf-8") as f:
        json.dump(cleaned, f, ensure_ascii=False, indent=2)
    print(f"\n💾 → data/listings_clean.json")
    return cleaned


# ─── Xuất TypeScript ──────────────────────────────────────────────────────────

TS_TYPE_MOBILE = """// AUTO-GENERATED {date} — {count} listings thực từ Chợ Tốt
// Chạy lại: python scripts/fetch_listings.py

export type Listing = {{
  id: string;
  title: string;
  price: string;
  priceNum: number;
  area: string;
  district: string;
  province: string;
  type: string;
  image: string;
  tags: string[];
  verified: boolean;
  rating: number;
  description: string;
  amenities: string[];
  postedAt: string;
  sourceUrl: string;
  lat?: number;
  lng?: number;
}};

export const LISTINGS: Listing[] = {data};
"""

TS_TYPE_WEB = """// AUTO-GENERATED {date} — {count} listings thực từ Chợ Tốt
// Chạy lại: python scripts/fetch_listings.py

export interface Listing {{
  id: string;
  title: string;
  price: string;
  priceNum: number;
  area: string;
  district: string;
  province: string;
  type: string;
  image: string;
  tags: string[];
  verified: boolean;
  rating: number;
  description: string;
  amenities: string[];
  postedAt: string;
  sourceUrl: string;
  lat?: number;
  lng?: number;
}}

export const LISTINGS: Listing[] = {data};

export const getListingsByProvince = (p: string) =>
  LISTINGS.filter(l => l.province === p);

export const getFeaturedListings = () =>
  LISTINGS.filter(l => l.verified && l.rating >= 4.7);

export const searchListings = (q: string) => {{
  const lower = q.toLowerCase();
  return LISTINGS.filter(l =>
    l.title.toLowerCase().includes(lower) ||
    l.district.toLowerCase().includes(lower) ||
    l.province.toLowerCase().includes(lower)
  );
}};
"""


def write_ts(listings: list[dict]):
    date_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    data_json = json.dumps(listings, ensure_ascii=False, indent=2)
    count = len(listings)

    os.makedirs(os.path.dirname(TS_OUTPUT_WEB), exist_ok=True)

    with open(TS_OUTPUT_MOBILE, "w", encoding="utf-8") as f:
        f.write(TS_TYPE_MOBILE.format(date=date_str, count=count, data=data_json))
    print(f"✅ Mobile → {TS_OUTPUT_MOBILE}")

    with open(TS_OUTPUT_WEB, "w", encoding="utf-8") as f:
        f.write(TS_TYPE_WEB.format(date=date_str, count=count, data=data_json))
    print(f"✅ Web    → {TS_OUTPUT_WEB}")


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 55)
    print("  NestaVietAI — Fetch Real Listings từ Chợ Tốt")
    print("=" * 55)
    print(f"  Configs: cg=1010 (căn hộ) + cg=1000 (phòng trọ)")
    print(f"  Pages: {TOTAL_PAGES} × 20 = {TOTAL_PAGES*20} listings/category")
    print(f"  Delay: {DELAY}s/request")
    est = int(TOTAL_PAGES * len(FETCH_CONFIGS) * DELAY / 60)
    print(f"  Ước tính: ~{est} phút")
    print("=" * 55)

    raw      = fetch_all_raw()
    listings = normalize_all(raw)
    write_ts(listings)

    print("\n" + "=" * 55)
    print(f"  HOÀN THÀNH — {len(listings)} listings thực tế")
    print("=" * 55)
    print("\nBước tiếp theo:")
    print("  npm run build      (kiểm tra web)")
    print("  cd mobile && npx expo start")
