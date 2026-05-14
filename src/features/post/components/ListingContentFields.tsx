interface ListingContentFieldsProps {
  title: string;
  description: string;
  price: string;
  priceUnit: "thang" | "m2";
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

export default function ListingContentFields({ title, description, price, priceUnit, onChange }: ListingContentFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-white/70 font-semibold" style={{ fontSize: "0.82rem" }}>
        Nội dung tin đăng
      </p>

      <div className="flex flex-col gap-1.5">
        <label className="text-white/40" style={{ fontSize: "0.74rem" }}>Tiêu đề</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Ví dụ: Căn hộ 2PN view sông, nội thất đầy đủ"
          style={inputStyle}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-white/40" style={{ fontSize: "0.74rem" }}>Mô tả</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Mô tả chi tiết về bất động sản..."
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-white/40" style={{ fontSize: "0.74rem" }}>Giá</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => onChange("price", e.target.value)}
            placeholder="Ví dụ: 10"
            style={{ ...inputStyle, flex: 1 }}
          />
          <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
            {(["thang", "m2"] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => onChange("priceUnit", unit)}
                className="px-3 py-2 transition-all"
                style={{
                  fontSize: "0.75rem",
                  background: priceUnit === unit ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.03)",
                  color: priceUnit === unit ? "#22d3ee" : "rgba(255,255,255,0.4)",
                  borderRight: unit === "thang" ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}
              >
                {unit === "thang" ? "triệu/tháng" : "triệu/m²"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
