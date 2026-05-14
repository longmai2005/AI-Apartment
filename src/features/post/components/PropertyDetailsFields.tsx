interface PropertyDetailsFieldsProps {
  disabled: boolean;
  area: string;
  floors: string;
  bedrooms: string;
  bathrooms: string;
  onChange: (field: string, val: string) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  fontSize: "0.85rem",
  outline: "none",
};

const FIELDS = [
  { key: "area",      label: "Diện tích (m²)",   placeholder: "Ví dụ: 50" },
  { key: "floors",    label: "Số tầng",           placeholder: "Ví dụ: 3" },
  { key: "bedrooms",  label: "Số phòng ngủ",      placeholder: "Ví dụ: 2" },
  { key: "bathrooms", label: "Số phòng tắm",      placeholder: "Ví dụ: 1" },
];

export default function PropertyDetailsFields({ disabled, area, floors, bedrooms, bathrooms, onChange }: PropertyDetailsFieldsProps) {
  const values: Record<string, string> = { area, floors, bedrooms, bathrooms };

  return (
    <div style={{ opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? "none" : "auto" }}>
      <p className="text-white/70 font-semibold mb-3" style={{ fontSize: "0.82rem" }}>
        Đặc điểm bất động sản *
      </p>
      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-white/40" style={{ fontSize: "0.74rem" }}>{label}</label>
            <input
              type="number"
              min="0"
              value={values[key]}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={placeholder}
              style={inputStyle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
