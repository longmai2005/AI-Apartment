interface PropertyTypeSelectorProps {
  propertyType: string;
  intent: string;
  onChange: (type: string, intent: "rent" | "sell" | "") => void;
}

const PROPERTY_TYPES = [
  "Nhà ở",
  "Căn hộ/Chung cư",
  "Phòng trọ",
  "Đất",
  "Văn phòng, Mặt bằng kinh doanh",
];

const INTENTS: { label: string; value: "rent" | "sell" }[] = [
  { label: "Cho thuê", value: "rent" },
  { label: "Bán", value: "sell" },
];

const sectionLabel = (text: string) => (
  <p className="text-white/70 font-semibold mb-3" style={{ fontSize: "0.82rem" }}>
    {text}
  </p>
);

export default function PropertyTypeSelector({ propertyType, intent, onChange }: PropertyTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        {sectionLabel("Loại bất động sản *")}
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => {
            const active = propertyType === type;
            return (
              <button
                key={type}
                onClick={() => onChange(type, intent as "rent" | "sell" | "")}
                className="px-3 py-1.5 rounded-xl transition-all"
                style={{
                  fontSize: "0.8rem",
                  border: active ? "1px solid #22d3ee" : "1px solid rgba(255,255,255,0.1)",
                  background: active ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.03)",
                  color: active ? "#22d3ee" : "rgba(255,255,255,0.5)",
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {sectionLabel("Tôi muốn *")}
        <div className="flex gap-2">
          {INTENTS.map(({ label, value }) => {
            const active = intent === value;
            return (
              <button
                key={value}
                onClick={() => onChange(propertyType, value)}
                className="px-4 py-1.5 rounded-xl transition-all"
                style={{
                  fontSize: "0.8rem",
                  border: active ? "1px solid #22d3ee" : "1px solid rgba(255,255,255,0.1)",
                  background: active ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.03)",
                  color: active ? "#22d3ee" : "rgba(255,255,255,0.5)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
