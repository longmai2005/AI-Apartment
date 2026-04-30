# NestaVietAI — Nền tảng cho thuê căn hộ thế hệ mới

Ứng dụng quản lý và tìm kiếm căn hộ cho thuê tại Việt Nam, tích hợp hệ thống AI Agents đa nhiệm, giao diện Liquid Glass hiện đại, hỗ trợ đầy đủ luồng từ đăng ký → ký hợp đồng → thanh toán → báo cáo.

---

## Cài đặt & Chạy

```bash
npm install
npm run dev        # Dev server tại http://localhost:5173
npm run build      # Production build
```

---

## Kiến trúc & Tech Stack

| Layer | Công nghệ |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Routing | React Router v7 (`createBrowserRouter`) |
| Styling | Tailwind CSS v4 (`@import 'tailwindcss'`) |
| Animation | Framer Motion v12 (`motion/react`) |
| Charts | Recharts (AreaChart, BarChart, PieChart) |
| Icons | Lucide React |
| Map data | Vietnam admin data (`src/data/vietnam-admin`) |

---

## Cấu trúc Routes

| Path | Component | Ghi chú |
|---|---|---|
| `/` | `LandingPage` | Trang chủ công khai |
| `/tenant/register` | `TenantRegister` | Đăng ký cư dân (3 bước) |
| `/tenant/login` | `TenantLogin` | Đăng nhập cư dân + đổi mật khẩu lần đầu |
| `/tenant/*` | `TenantApp` | Dashboard cư dân (Home / AI Chat / Khám phá / Dịch vụ / Hóa đơn) |
| `/landlord/register` | `LandlordRegister` | Đăng ký quản lý (4 bước) |
| `/landlord/login` | `LandlordLogin` | Đăng nhập quản lý |
| `/landlord/*` | `LandlordApp` | Portal quản lý (Dashboard / BĐS / Đăng tin / Báo cáo / Cài đặt) |
| `/contracts` | `ContractsPage` | 🔒 Yêu cầu đăng nhập landlord |
| `/payments` | `PaymentsPage` | 🔒 Yêu cầu đăng nhập cư dân |
| `/reports` | `ReportsPage` | 🔒 Yêu cầu đăng nhập landlord |
| `/security` | `SecurityPage` | Trang bảo mật công khai |
| `/admin/login` | `AdminLogin` | Đăng nhập admin |
| `/admin/*` | `AdminPanel` | 🔒 Yêu cầu admin auth (sessionStorage) |

---

## Tính năng chính

### Cư dân (Tenant)
- **Đăng ký 3 bước**: chọn nhu cầu → thông tin cá nhân → xác nhận
- **Email xác nhận mock**: hiển thị mật khẩu tạm thời sau đăng ký
- **Đăng nhập bắt buộc đổi mật khẩu**: phát hiện temp-password bằng regex, bắt buộc đặt lại
- **Quên mật khẩu**: flow gửi email mock
- **Dashboard cư dân**: trang chủ, AI Chat (Super Broker), Khám phá căn hộ, Yêu cầu dịch vụ, Hóa đơn + VietQR

### Quản lý tòa nhà (Landlord)
- **Đăng ký 4 bước**: xác minh danh tính → thông tin tòa nhà → pháp lý & ngân hàng → dịch vụ
- **Chọn phường/xã**: thanh tìm kiếm + danh sách nút bấm (không dùng `<select>`)
- **Portal quản lý**: Dashboard KPI, biểu đồ doanh thu/lấp đầy, SLA alerts từ AI Agents
- **Đăng tin**: wizard 3 bước + Listing Verifier AI (mock validation)
- **Thông tin người dùng đồng bộ**: tên, số căn hộ lấy từ localStorage sau đăng ký

### AI Agents
| Agent | Nhiệm vụ |
|---|---|
| Super Broker AI | Conversational search, gợi ý căn hộ, đặt lịch xem |
| Listing Verifier | Kiểm duyệt tiêu đề, mô tả, ảnh tin đăng |
| Smart Concierge | Triage sự cố, dispatch kỹ thuật, theo dõi SLA |
| Contract & Admin | Hóa đơn VietQR, hợp đồng điện tử, báo cáo tài chính |

### Hợp đồng điện tử
- Form → Preview → Done (3 bước)
- Tự động tính ngày kết thúc từ ngày bắt đầu + số tháng
- Sinh mã hợp đồng HD-2025-XXX

### Thanh toán
- Bảng phân tích hóa đơn: tiền thuê + phí dịch vụ 5% + VAT 10%
- Mock QR code SVG (21×21 module, finder patterns chuẩn)
- Copy số tài khoản vào clipboard

### Báo cáo tài chính
- Chuyển đổi dữ liệu theo kỳ: Tháng / Quý / Năm
- Biểu đồ Area, Bar, Pie (Recharts)
- KPI thay đổi theo kỳ được chọn

---

## Auth & Bảo mật

- **Cư dân**: `localStorage.nv-tenant-logged-in` + `nv-tenant-user`
- **Quản lý**: `localStorage.nv-landlord-logged-in` + `nv-landlord-user`
- **Admin**: `sessionStorage.nv-admin-auth` (guard component `isAdminAuthenticated()`)
- Route guards chuyển hướng về trang login tương ứng nếu chưa xác thực

---

## Design System — Liquid Glass

- **Màu nền**: `var(--nv-bg)` — dark `#070B16`, light `#F0F4FF`
- **Glassmorphism**: `backdrop-filter: blur(24px) saturate(180%)` + `rgba()` backgrounds
- **Aurora layers**: 3 radial gradient blobs cố định phía sau toàn trang
- **Navbar**: luôn kính mờ (không chờ scroll), border bottom tinh tế
- **Listing cards**: hover với shadow màu theo badge, border glow tương ứng

---

## Dữ liệu địa chính Việt Nam

File `src/data/vietnam-admin.ts` cung cấp:
- `getProvinceNames()` — danh sách 63 tỉnh/thành
- `getAllWardsInProvince(city)` — danh sách phường/xã theo tỉnh

---

*Dự án demo UI/UX — không có backend thực. Mọi xác thực và dữ liệu được mô phỏng phía client.*
