interface PropertyLocationFieldsProps {
  disabled: boolean;
  province: string;
  district: string;
  ward: string;
  onChange: (field: string, val: string) => void;
}

const PROVINCES = [
  "Hà Nội",
  "TP.HCM",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Bình Dương",
  "Đồng Nai",
];

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  fontSize: "0.85rem",
  outline: "none",
  appearance: "none" as const,
};

export default function PropertyLocationFields({ disabled, province, district, ward, onChange }: PropertyLocationFieldsProps) {
  return (
    <div style={{ opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? "none" : "auto" }}>
      <div className="flex items-baseline gap-2 mb-3">
        <p className="text-white/70 font-semibold" style={{ fontSize: "0.82rem" }}>
          Vị trí bất động sản *
        </p>
        {disabled && (
          <span className="text-white/30" style={{ fontSize: "0.74rem" }}>
            Vui lòng chọn Loại và Tôi muốn trước
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-white/40" style={{ fontSize: "0.74rem" }}>Tỉnh/Thành phố</label>
          <select
            value={province}
            onChange={(e) => { onChange("province", e.target.value); onChange("district", ""); onChange("ward", ""); }}
            style={selectStyle}
          >
            <option value="">Chọn tỉnh/thành</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p} style={{ background: "#0f1829" }}>{p}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-white/40" style={{ fontSize: "0.74rem" }}>Quận/Huyện</label>
          <select
            value={district}
            onChange={(e) => { onChange("district", e.target.value); onChange("ward", ""); }}
            disabled={!province}
            style={{ ...selectStyle, opacity: province ? 1 : 0.4 }}
          >
            <option value="">{province ? "Chọn quận/huyện" : "Chọn tỉnh/thành trước"}</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-white/40" style={{ fontSize: "0.74rem" }}>Phường/Xã</label>
          <select
            value={ward}
            onChange={(e) => onChange("ward", e.target.value)}
            disabled={!district}
            style={{ ...selectStyle, opacity: district ? 1 : 0.4 }}
          >
            <option value="">{district ? "Chọn phường/xã" : "Chọn tỉnh/thành trước"}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
