import { useState } from "react";
import { motion } from "motion/react";
import {
  Search, PlusCircle, Hash,
  UserCheck, UserX, Clock, MoreHorizontal,
} from "lucide-react";

function getBuildingTenants() {
  try { return JSON.parse(localStorage.getItem("nv-building-tenants") || "[]"); } catch { return []; }
}

export interface TenantsTabProps {
  landlordBuilding: string;
}

export default function TenantsTab({ landlordBuilding }: TenantsTabProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "cancelled">("all");
  const raw: Array<{
    name: string; email: string; phone?: string; unit: string;
    buildingName: string; registeredAt: string; status: string;
  }> = getBuildingTenants();

  // Combine localStorage tenants with sample data for demo
  const DEMO_TENANTS = [
    { name: "Nguyễn Thị Lan", email: "lan.nguyen@gmail.com", phone: "0901 234 567", unit: "1204", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-01-05T08:00:00Z", status: "active" },
    { name: "Trần Văn Minh", email: "minh.tran@gmail.com", phone: "0912 345 678", unit: "805", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-02-10T09:30:00Z", status: "active" },
    { name: "Lê Thị Hoa", email: "hoa.le@gmail.com", phone: "0903 456 789", unit: "1501", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-03-15T10:00:00Z", status: "pending" },
    { name: "Phạm Quốc Tuấn", email: "tuan.pham@gmail.com", phone: "0934 567 890", unit: "703", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-04-01T14:00:00Z", status: "pending" },
    { name: "Hoàng Thị Mai", email: "mai.hoang@gmail.com", phone: "0945 678 901", unit: "1002", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2024-12-20T08:00:00Z", status: "active" },
    { name: "Đỗ Văn Long", email: "long.do@gmail.com", phone: "0956 789 012", unit: "601", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-01-28T11:00:00Z", status: "cancelled" },
  ];

  const allTenants = [...raw, ...DEMO_TENANTS.filter(d => !raw.find(r => r.email === d.email))];
  const filtered = allTenants.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.email.includes(search) || t.unit.includes(search);
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: allTenants.length,
    active: allTenants.filter(t => t.status === "active").length,
    pending: allTenants.filter(t => t.status === "pending").length,
    cancelled: allTenants.filter(t => t.status === "cancelled").length,
  };

  const statusCfg: Record<string, { label: string; class: string }> = {
    active: { label: "Đang ở", class: "bg-emerald-100 text-emerald-700" },
    pending: { label: "Chờ duyệt", class: "bg-amber-100 text-amber-700" },
    cancelled: { label: "Đã hủy", class: "bg-red-100 text-red-600" },
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Quản lý cư dân</h2>
            <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>{allTenants.length} cư dân trong toà nhà</p>
          </div>
          <motion.button whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl shadow-sm"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}>
            <PlusCircle size={15} />Thêm cư dân
          </motion.button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1" style={{ minWidth: "200px" }}>
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm cư dân, email, phòng..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-violet-400 transition-colors bg-white"
              style={{ fontSize: "0.85rem" }} />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "pending", "cancelled"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl border transition-all ${filter === f ? "bg-violet-50 border-violet-300 text-violet-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}
                style={{ fontSize: "0.78rem" }}>
                {f === "all" ? "Tất cả" : f === "active" ? "Đang ở" : f === "pending" ? "Chờ duyệt" : "Đã hủy"}
                <span className="ml-1.5 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full" style={{ fontSize: "0.65rem" }}>{counts[f]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tenants table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid border-b border-gray-100 px-5 py-3 bg-gray-50" style={{ gridTemplateColumns: "1fr 1.5fr 1fr 1fr auto" }}>
            {["Cư dân", "Email / SĐT", "Phòng", "Trạng thái", ""].map(h => (
              <span key={h} className="text-gray-500" style={{ fontSize: "0.73rem", fontWeight: 600, textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center text-gray-400" style={{ fontSize: "0.85rem" }}>
              Không có cư dân phù hợp
            </div>
          ) : (
            filtered.map((t, i) => (
              <motion.div key={t.email + i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="grid px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors items-center"
                style={{ gridTemplateColumns: "1fr 1.5fr 1fr 1fr auto" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold" style={{ fontSize: "0.8rem" }}>{t.name.split(" ").pop()?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold" style={{ fontSize: "0.82rem" }}>{t.name}</p>
                    <p className="text-gray-400" style={{ fontSize: "0.67rem" }}>
                      {new Date(t.registeredAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700" style={{ fontSize: "0.78rem" }}>{t.email}</p>
                  {t.phone && <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>{t.phone}</p>}
                </div>
                <div className="flex items-center gap-1.5">
                  <Hash size={12} className="text-gray-400" />
                  <span className="text-gray-800 font-semibold" style={{ fontSize: "0.82rem" }}>{t.unit}</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusCfg[t.status]?.class || "bg-gray-100 text-gray-600"}`}
                  style={{ fontSize: "0.72rem", fontWeight: 600, width: "fit-content" }}>
                  {t.status === "active" ? <UserCheck size={11} /> : t.status === "pending" ? <Clock size={11} /> : <UserX size={11} />}
                  {statusCfg[t.status]?.label || t.status}
                </span>
                <div className="flex items-center gap-1">
                  {t.status === "pending" && (
                    <button className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      style={{ fontSize: "0.7rem", fontWeight: 600 }}>Duyệt</button>
                  )}
                  <button className="p-1.5 text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
