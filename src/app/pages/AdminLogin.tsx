import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Building2, Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";

// ─── Thêm tài khoản admin ở đây ───────────────────────────────────────
// Trong production: thay bằng auth backend thực (JWT, OAuth, v.v.)
const ADMIN_USERS = [
  { email: "admin@nestaviet.vn",   password: "NestaViet@Admin2025",   role: "Siêu quản trị",  name: "Admin NestaViet" },
  { email: "manager@nestaviet.vn", password: "NestaViet@Manager2025", role: "Quản trị viên",   name: "Manager" },
  { email: "dev@nestaviet.vn",     password: "NestaViet@Dev2025",     role: "Developer",       name: "Dev Team" },
];

const AUTH_KEY = "nv_admin_session";

export function isAdminAuthenticated(): boolean {
  try {
    const s = sessionStorage.getItem(AUTH_KEY);
    if (!s) return false;
    const { expiry } = JSON.parse(s);
    return Date.now() < expiry;
  } catch { return false; }
}

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const user = ADMIN_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      sessionStorage.setItem(
        AUTH_KEY,
        JSON.stringify({
          email: user.email,
          name: user.name,
          role: user.role,
          expiry: Date.now() + 8 * 60 * 60 * 1000, // 8 giờ
        })
      );
      navigate("/admin/dashboard", { replace: true });
    } else {
      setError("Email hoặc mật khẩu không đúng.");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: `
          radial-gradient(ellipse 70% 50% at 20% 30%, rgba(139,92,246,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 60% 60% at 80% 70%, rgba(6,182,212,0.06) 0%, transparent 55%),
          #07101C
        `,
        backgroundImage:
          "radial-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), " +
          "radial-gradient(ellipse 70% 50% at 20% 30%, rgba(139,92,246,0.08) 0%, transparent 60%), " +
          "radial-gradient(ellipse 60% 60% at 80% 70%, rgba(6,182,212,0.06) 0%, transparent 55%), " +
          "linear-gradient(#07101C, #07101C)",
        backgroundSize: "28px 28px, 100% 100%, 100% 100%, 100% 100%",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div
          className="rounded-2xl border border-white/8 p-8"
          style={{ background: "rgba(12,23,38,0.95)", backdropFilter: "blur(16px)" }}
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center mb-4 shadow-xl shadow-violet-500/25">
              <Shield size={26} className="text-white" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={15} className="text-violet-400" />
              <span className="text-violet-400 font-mono" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                admin.nestaviet.vn
              </span>
            </div>
            <h1 className="text-white text-center" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              Admin Portal
            </h1>
            <p className="text-white/40 text-center mt-1" style={{ fontSize: "0.8rem" }}>
              Khu vực dành riêng cho quản trị viên
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Email quản trị
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  placeholder="admin@nestaviet.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/12 rounded-xl py-3 pl-9 pr-4 text-white placeholder-white/22 outline-none focus:border-violet-500/50 transition-colors"
                  style={{ fontSize: "0.875rem" }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Mật khẩu
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/12 rounded-xl py-3 pl-9 pr-10 text-white placeholder-white/22 outline-none focus:border-violet-500/50 transition-colors"
                  style={{ fontSize: "0.875rem" }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/28 hover:text-white/55 transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2.5"
              >
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400" style={{ fontSize: "0.8rem" }}>{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg shadow-violet-500/20 mt-2"
              style={{ fontSize: "0.9rem" }}
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round"/>
                </svg>
              ) : (
                <Lock size={15} />
              )}
              {loading ? "Đang xác thực..." : "Đăng nhập"}
            </button>
          </form>

          {/* Back link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-white/28 hover:text-white/50 transition-colors"
              style={{ fontSize: "0.75rem" }}
            >
              ← Về trang chủ
            </button>
          </div>
        </div>

        <p className="text-center text-white/18 mt-4" style={{ fontSize: "0.68rem" }}>
          Khu vực bảo mật — Mọi lần đăng nhập đều được ghi lại
        </p>
      </motion.div>
    </div>
  );
}
