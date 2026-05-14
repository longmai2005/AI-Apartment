import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { X } from "lucide-react";

interface QuickLoginModalProps {
  mode: "chat" | "post";
  onClose: () => void;
  onSuccess: () => void;
}

export function QuickLoginModal({ mode, onClose, onSuccess }: QuickLoginModalProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const title =
    mode === "chat"
      ? "Đăng nhập để trò chuyện với AI"
      : "Đăng nhập để đăng tin";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    localStorage.setItem("nv-quick-email", email.trim());
    onSuccess();
  };

  const handleRegister = () => {
    onClose();
    navigate("/tenant/register");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "white",
    fontSize: "0.88rem",
    outline: "none",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm rounded-2xl p-8"
        style={{
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(15,24,41,0.95)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
        >
          <X size={16} />
        </button>

        <h2 className="text-white font-bold mb-6" style={{ fontSize: "1.1rem", lineHeight: 1.3 }}>
          {title}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/50" style={{ fontSize: "0.78rem" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/50" style={{ fontSize: "0.78rem" }}>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          {error && (
            <p className="text-red-400" style={{ fontSize: "0.78rem" }}>{error}</p>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 rounded-xl text-white font-semibold mt-1"
            style={{
              fontSize: "0.88rem",
              background: "linear-gradient(135deg,#22d3ee,#3b82f6)",
              boxShadow: "0 0 18px rgba(34,211,238,0.25)",
            }}
          >
            Đăng nhập
          </motion.button>
        </form>

        <p className="text-center mt-5" style={{ fontSize: "0.8rem" }}>
          <span className="text-white/35">Chưa có tài khoản? </span>
          <button
            onClick={handleRegister}
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            Đăng ký
          </button>
        </p>
      </motion.div>
    </div>,
    document.body
  );
}
