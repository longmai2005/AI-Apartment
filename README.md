# NestaVietAI — Nền tảng Cho thuê Căn hộ Thế hệ Mới

> Hệ thống quản lý và tìm kiếm căn hộ cho thuê tại Việt Nam tích hợp **4 AI Agents** đa nhiệm vụ, giao diện Liquid Glass cao cấp. Monorepo bao gồm **Web App** (React 19 + Vite) và **Mobile App** (React Native + Expo) — cả hai nền tảng đều có đầy đủ 4 AI Agents.

---

## Mục lục

1. [Cấu trúc Monorepo](#cấu-trúc-monorepo)
2. [4 AI Agents — Kiến trúc nghiệp vụ](#4-ai-agents--kiến-trúc-nghiệp-vụ)
3. [Web App](#web-app)
4. [Mobile App](#mobile-app)
5. [Design System](#design-system)
6. [Auth & Bảo mật](#auth--bảo-mật)
7. [Trạng thái dự án](#trạng-thái-dự-án)

---

## Cấu trúc Monorepo

```
Apartment For Rent/
├── src/                            ← Web App (React 19 + Vite)
│   ├── app/pages/                  ← LandingPage, TenantApp, LandlordApp, AdminPanel…
│   ├── services/
│   │   ├── listingVerifier.ts      ← Gemini 2.5-Flash API (Agent 1 — thực)
│   │   └── agents/                 ← ★ File riêng cho từng agent
│   │       ├── index.ts            ← Agent registry + unified exports
│   │       ├── listingVerifier.ts  ← Agent 1: types, SEO helpers, mock
│   │       ├── superBroker.ts      ← Agent 2: types, mock apartments, reply
│   │       ├── smartConcierge.ts   ← Agent 3: types, ticket mock, triage
│   │       └── contractAdmin.ts    ← Agent 4: types, contract/invoice mock, VietQR
│   ├── data/vietnam-admin.ts       ← 63 tỉnh/thành + phường/xã
│   └── styles/index.css            ← Liquid Glass design system
├── mobile/                         ← Mobile App (React Native + Expo SDK 53)
│   ├── app/
│   │   ├── (tabs)/                 ← Home · Search · Chat (4-Agent Hub) · Saved · Profile
│   │   ├── (auth)/                 ← Tenant & Landlord login/register
│   │   ├── listing/[id].tsx        ← Chi tiết tin + đặt lịch xem
│   │   └── notifications.tsx
│   └── constants/
│       ├── theme.ts                ← Colors, Font, Radius tokens
│       ├── listings.ts             ← 10 listings mock data
│       ├── savedStore.ts           ← Reactive pub/sub saved store
│       └── agents/                 ← ★ File riêng cho từng agent
│           ├── index.ts            ← Agent registry + unified reply dispatcher
│           ├── superBroker.ts      ← Agent 2: config, quick prompts, mock reply
│           ├── smartConcierge.ts   ← Agent 3: config, quick prompts, mock reply
│           ├── contractAdmin.ts    ← Agent 4: config, quick prompts, mock reply
│           └── listingVerifier.ts  ← Agent 1: config, quick prompts, mock reply
├── package.json                    ← Web dependencies
└── README.md
```

> **Quy ước cho nhóm:** Khi nhóm hoàn thiện real data / API, chỉ cần vào đúng file agent tương ứng và thay mock function bằng `async` function gọi API thực. Mọi TODO đều được comment rõ endpoint + request/response schema.

---

## 4 AI Agents — Kiến trúc nghiệp vụ

Cả **Web** và **Mobile** đều tích hợp đầy đủ 4 agents. Web có giao diện riêng cho từng agent theo vai trò (Tenant/Landlord). Mobile có **4-Agent Hub** trong tab Chat, cho phép chuyển đổi giữa các agents ngay lập tức.

### Agent 1 — Listing Verifier · 🔍 Kiểm duyệt & Chuẩn hóa

**Giai đoạn:** Đầu vào — Onboarding tài sản

| | Chi tiết |
|---|---|
| **Input** | Text mô tả thô (sai chính tả, viết tắt) + ảnh tải lên từ chủ nhà |
| **NLP Pipeline** | LLM trích xuất thực thể: diện tích, giá, số phòng, nội thất, chính sách thú cưng |
| **Auto-Copywriting** | Sinh tiêu đề + mô tả tối ưu từ khóa SEO từ dữ liệu thô |
| **Vision AI** | Auto-tagging ảnh · đánh giá chất lượng · phát hiện watermark/ảnh sao chép |
| **Output** | JSON chuẩn hóa 100% sẵn sàng lưu DB · tin không đạt → "Bản nháp" + phản hồi tự động |
| **Giá trị** | Tiết kiệm 90% thời gian kiểm duyệt thủ công · đảm bảo Clean Data |

**Web:** Tab "Đăng tin" trong LandlordApp — form 3 bước + nút "Kiểm tra bằng Listing Verifier AI" gọi Gemini 2.5-Flash API thực.
**Mobile:** Tab Chat → chọn 🔍 Listing Verifier · quick prompts: tối ưu tiêu đề, kiểm tra ảnh, SEO mô tả.

---

### Agent 2 — Super Broker AI · 🤖 Tìm kiếm & Tư vấn Ngữ cảnh

**Giai đoạn:** Tiếp cận khách hàng — Lead Generation

| | Chi tiết |
|---|---|
| **Input** | Câu hỏi ngôn ngữ tự nhiên — VD: *"Tìm studio dưới 8tr, đi làm Q.1 ≤ 15 phút, cho nuôi mèo"* |
| **Intent Extraction** | Chuyển câu nói → constraints: `Max_Price=8M`, `Pet_Friendly=True`, `Commute≤15m` |
| **RAG Search** | Embedding truy vấn → đối chiếu Vector DB listing → top-3 kết quả ngữ nghĩa |
| **Reasoning** | Giải thích lý do gợi ý từng căn ("phù hợp vì...") thay vì chỉ trả link |
| **Output** | Đề xuất cá nhân hóa + tự động chốt lịch xem + đồng bộ Google Calendar |
| **Giá trị** | Phục vụ 24/7 · Conversational Search tăng tỷ lệ chốt deal |

**Web:** Tab "AI Chat" trong TenantApp — giao diện chat đầy đủ, hiển thị card listing + bản đồ mock, powered by RAG + Agent SDK.
**Mobile:** Tab Chat → chọn 🤖 Super Broker AI (mặc định) · quick prompts: tìm phòng, so sánh quận, hướng dẫn ký HĐ.

---

### Agent 3 — Smart Concierge · 🛠️ Vận hành & Điều phối SLA

**Giai đoạn:** Hậu mãi & Lưu trú — Tenant Care

| | Chi tiết |
|---|---|
| **Input** | Báo cáo sự cố hoặc yêu cầu hỗ trợ từ cư dân (App/Chat) |
| **Triage & Routing** | Phân loại mức độ: Khẩn cấp (vỡ ống nước) · Trung bình · Thường (cháy bóng đèn) |
| **Auto Dispatching** | Tra lịch trực đội kỹ thuật → phân việc qua hệ thống nội bộ / Zalo |
| **Multi-party Sync** | Cập nhật trạng thái realtime cho cả cư dân và chủ nhà |
| **Output** | Ticket với người phụ trách · ETA · Báo cáo CSAT sau khi đóng |
| **Giá trị** | Giảm thời gian chờ SLA · chủ nhà không cần nhận cuộc gọi lúc nửa đêm |

**Web:** Tab "Yêu cầu dịch vụ" trong TenantApp — form báo sự cố + ticket board với SLA timer · hiển thị trong dashboard Landlord.
**Mobile:** Tab Chat → chọn 🛠️ Smart Concierge · Profile menu "Phòng đang thuê" và "Hỗ trợ" → tự động mở agent này.

---

### Agent 4 — Contract & Admin · 📋 Pháp lý & Kế toán Tự động

**Giai đoạn:** Tài chính & Thu hồi công nợ — Billing & Operations

| | Chi tiết |
|---|---|
| **Input** | Dữ liệu điện/nước (IoT API / nhập tay) + thông tin hợp đồng + webhook ngân hàng |
| **Dynamic Calculation** | Tính chi phí theo công thức riêng từng HĐ (giá điện nhà nước/KD, phí theo diện tích) |
| **Document Generation** | Render PDF hóa đơn/HĐ với đầy đủ thông tin pháp lý + mã VietQR |
| **Payment Reconciliation** | Lắng nghe webhook → khi giao dịch khớp mã HĐ → tự động gạch nợ |
| **Automated Dunning** | Chuỗi tin nhắn nhắc nợ: lịch sự → cảnh báo → khẩn cấp theo timeline |
| **Output** | Hóa đơn hàng tháng gửi cư dân · Báo cáo dòng tiền gửi chủ nhà |
| **Giá trị** | Loại bỏ 100% sai sót tính toán thủ công · minh bạch tài chính tuyệt đối |

**Web:** `ContractsPage` (ký HĐ điện tử 3 bước) + `PaymentsPage` (VietQR + lịch sử) + `ReportsPage` (Recharts).
**Mobile:** Tab Chat → chọn 📋 Contract & Admin · Profile menu "Hợp đồng" và "Thanh toán" → tự động mở agent này.

---

## Web App

### Cài đặt & Chạy

```bash
# Từ thư mục root
npm install
npm run dev          # http://localhost:5173
npm run build        # → dist/
```

### Tech Stack

| Layer | Công nghệ |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Routing | React Router v7 (`createBrowserRouter`) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion v12 (`motion/react`) |
| Charts | Recharts (AreaChart, BarChart, PieChart) |
| Icons | Lucide React |
| AI (Listing Verifier) | Gemini 2.5-Flash API (`services/listingVerifier.ts`) |
| Địa chính | `src/data/vietnam-admin.ts` — 63 tỉnh/thành + phường/xã |

### Cấu trúc Routes

| Path | Component | Vai trò |
|---|---|---|
| `/` | `LandingPage` | Public |
| `/tenant/login` | `TenantLogin` | Cư dân |
| `/tenant/register` | `TenantRegister` | Cư dân — đăng ký 3 bước |
| `/tenant/*` | `TenantApp` | Dashboard cư dân (Home · Chat · Explore · Service · Invoice) |
| `/landlord/login` | `LandlordLogin` | Chủ nhà |
| `/landlord/register` | `LandlordRegister` | Chủ nhà — đăng ký 4 bước |
| `/landlord/*` | `LandlordApp` | Portal (Dashboard · Properties · Listing · Reports · Agents) |
| `/contracts` | `ContractsPage` | Contract Agent — ký HĐ điện tử |
| `/payments` | `PaymentsPage` | Contract Agent — VietQR thanh toán |
| `/reports` | `ReportsPage` | Contract Agent — báo cáo tài chính |
| `/security` | `SecurityPage` | Public |
| `/admin/*` | `AdminPanel` | Quản trị hệ thống |
| `/manager/*` | `ManagerApp` | Vận hành tòa nhà |
| `/dev/*` | `DevApp` | Developer portal |

### Tính năng nổi bật

**Tenant Portal**
- Đăng ký 3 bước → email mock → bắt buộc đổi mật khẩu lần đầu
- AI Chat (Super Broker) — conversational search với card listing + bản đồ
- Smart Concierge — báo sự cố + ticket board + SLA countdown
- Hóa đơn chi tiết + VietQR SVG (21×21 module, finder patterns chuẩn)

**Landlord Portal**
- Đăng ký 4 bước: xác minh → tòa nhà → pháp lý & ngân hàng → dịch vụ
- Chọn phường/xã: searchable button list (không dùng `<select>`)
- **Listing Verifier AI** — gọi Gemini 2.5-Flash API thực: NLP extraction + Vision check
- **AgentsTab** — dashboard 4 agents với status, metrics, event stream realtime mock
- Dashboard KPI + biểu đồ doanh thu/lấp đầy + SLA alerts

**Hợp đồng điện tử**
- Form → Preview (render đầy đủ điều khoản) → Done
- Tự động tính ngày kết thúc từ ngày bắt đầu + số tháng
- Sinh mã HĐ: HD-2025-XXX

---

## Mobile App

### Cài đặt & Chạy

```bash
cd mobile
npm install
npx expo start           # QR → Expo Go (iOS / Android)
npx expo start --ios     # Simulator iOS (cần Xcode)
npx expo start --android # Emulator Android
```

### Tech Stack

| Layer | Công nghệ |
|---|---|
| Framework | React Native + Expo SDK 53 |
| Routing | Expo Router v4 (file-based) |
| Navigation | Stack + Bottom Tabs |
| State | Module pub/sub store — không cần Redux |
| Styling | `StyleSheet.create()` + design tokens |
| TypeScript | Strict — 0 errors (`tsc --noEmit`) |

### 4-Agent Hub (Tab Chat)

Tab Chat là trung tâm AI của mobile app — chuyển đổi giữa 4 agents bằng selector ngang:

```
[ 🤖 Super Broker AI ] [ 🛠️ Smart Concierge ] [ 📋 Contract & Admin ] [ 🔍 Listing Verifier ]
```

Mỗi agent có:
- **Màu accent riêng**: Cyan · Emerald · Violet · Amber
- **Quick prompts** phù hợp với nghiệp vụ
- **Lịch sử chat độc lập** (không mất khi switch agent)
- **Deep link qua URL param**: `/(tabs)/chat?agent=concierge`

Profile menu tự động mở đúng agent:
| Menu item | Agent được mở |
|---|---|
| Phòng đang thuê | 🛠️ Smart Concierge |
| Hợp đồng của tôi | 📋 Contract & Admin |
| Thanh toán | 📋 Contract & Admin |
| Hỗ trợ | 🛠️ Smart Concierge |

### Màn hình Mobile

| Route | Màn hình | Agent tích hợp |
|---|---|---|
| `(tabs)/` | Home Feed | Listing Verifier (badge "AI Verified") |
| `(tabs)/search` | Khám phá | — |
| `(tabs)/chat` | **4-Agent Hub** | Tất cả 4 agents |
| `(tabs)/saved` | Đã lưu | Super Broker (nút "Hỏi AI so sánh") |
| `(tabs)/profile` | Tài khoản | Deep links → agents |
| `listing/[id]` | Chi tiết tin | Listing Verifier badge + Super Broker CTA |
| `notifications` | Thông báo | Feed từ cả 4 agents |
| `(auth)/tenant-login` | Đăng nhập cư dân | — |
| `(auth)/tenant-register` | Đăng ký cư dân | — |
| `(auth)/landlord-login` | Đăng nhập chủ nhà | — |
| `(auth)/landlord-register` | Đăng ký chủ nhà (PRO plan) | — |

### Tính năng Mobile nổi bật

**Home Feed**
- Tìm kiếm realtime + clear button + bộ lọc (loại phòng, giá, quận)
- Section "⭐ Nổi bật" — horizontal scroll các tin AI Verified có rating ≥ 4.7
- Heart button ❤️ reactive trên mọi card (pub/sub store — đồng bộ instant)

**Chi tiết tin đăng**
- Hero image full-width + save button (❤️/🤍)
- AI Analysis card (rating, verified status, phân tích thị trường)
- Modal đặt lịch xem: 4 preset ngày + 6 preset giờ + ghi chú tùy chọn
- Footer CTA: "🤖 Hỏi AI" → Super Broker · "📅 Đặt lịch xem"

**Saved Store** (`constants/savedStore.ts`)
```ts
// Module-level reactive — không cần Context Provider
export function toggleSave(id: string)   // toggle & notify all subscribers
export function useSaved(): Set<string>  // React hook tự re-render khi có thay đổi
```

---

## Design System

### Web — Liquid Glass

| Token | Giá trị |
|---|---|
| Background dark | `#070B16` |
| Background light | `#F0F4FF` |
| Glassmorphism | `backdrop-filter: blur(24px) saturate(180%)` |
| Aurora | 3 radial gradient blobs cố định |
| Card hover | Shadow màu theo badge + border glow |

### Mobile — Dark Space

| Token | Giá trị | Dùng cho |
|---|---|---|
| `Colors.bg` | `#030B14` | Nền chính |
| `Colors.bgCard` | `#070F20` | Card, input |
| `Colors.cyan` | `#22D3EE` | Tenant accent · Super Broker |
| `Colors.emerald` | `#34D399` | AI Verified · Smart Concierge |
| `Colors.violet` | `#A78BFA` | Landlord accent · Contract Agent |
| Amber | `#F59E0B` | Listing Verifier |
| `Colors.border` | `rgba(255,255,255,0.06)` | Đường kẻ |

---

## Auth & Bảo mật

### Web
| Vai trò | Cơ chế |
|---|---|
| Cư dân | `localStorage: nv-tenant-logged-in` + `nv-tenant-user` |
| Chủ nhà | `localStorage: nv-landlord-logged-in` + `nv-landlord-user` |
| Admin | `sessionStorage: nv-admin-auth` · guard `isAdminAuthenticated()` |

Route guards tự động redirect về login tương ứng nếu chưa xác thực.

### Mobile
Mock auth (router.replace sau submit). JWT + AsyncStorage sẽ implement cùng backend thực.

---

## Trạng thái dự án

| Hạng mục | Web | Mobile | Ghi chú |
|---|---|---|---|
| Landing Page | ✅ | — | Scroll animations, bento grid, stats |
| 4-Agent Hub UI | ✅ | ✅ | Web: tabs riêng · Mobile: switcher |
| **Listing Verifier** | ✅ API thực | ✅ Mock | Web gọi Gemini 2.5-Flash |
| **Super Broker** | ✅ Mock | ✅ Mock | RAG UI đầy đủ |
| **Smart Concierge** | ✅ Mock | ✅ Mock | Ticket board + SLA |
| **Contract & Admin** | ✅ Mock | ✅ Mock | HĐ + VietQR + báo cáo |
| Portal Tenant | ✅ | ✅ | Chat, Explore, Service, Invoice |
| Portal Landlord | ✅ | ✅ auth | Dashboard, Listing, Reports, Agents |
| Portal Admin | ✅ | — | Quản trị hệ thống |
| Saved listings | — | ✅ | Reactive pub/sub |
| Notifications | — | ✅ | 7 loại từ 4 agents |
| Hợp đồng điện tử | ✅ | — | Form → Preview → Done |
| VietQR thanh toán | ✅ | — | SVG mock (chuẩn QR) |
| Báo cáo tài chính | ✅ | — | Recharts: Area/Bar/Pie |
| Backend thực | — | — | Rust API Gateway (planned) |
| Database thực | — | — | PostgreSQL + Qdrant (planned) |
| AI Core thực | Partial | — | Listing Verifier → Gemini |

---

*NestaVietAI v1.0.0 · Made with ❤️ in Vietnam*
*Frontend prototype đủ demo toàn bộ luồng sản phẩm với 4 AI Agents. Backend AI thực (Python + LangGraph) cần thêm 6–12 tháng phát triển.*
