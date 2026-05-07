import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Font, Radius } from "../constants/theme";

type Notif = {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  color: string;
  unread: boolean;
};

const NOTIFS: Notif[] = [
  { id: "1", icon: "🤖", title: "AI tìm thấy 3 phòng phù hợp", body: "Studio dưới 8tr tại Quận 1 & Quận 7 — vừa được đăng mới hôm nay.", time: "2 phút trước", color: Colors.cyan, unread: true },
  { id: "2", icon: "✅", title: "Tin đăng đã được xác minh", body: "Studio hiện đại Quận 1 — Listing Verifier AI xác nhận ảnh & thông tin khớp 100%.", time: "1 giờ trước", color: Colors.emerald, unread: true },
  { id: "3", icon: "📄", title: "Hợp đồng sắp hết hạn", body: "Hợp đồng thuê phòng của bạn sẽ hết hạn vào 15/06/2026. Liên hệ chủ nhà để gia hạn.", time: "3 giờ trước", color: Colors.violet, unread: true },
  { id: "4", icon: "💳", title: "Nhắc nhở thanh toán", body: "Tiền thuê tháng 6 đến hạn vào 01/06/2026. Thanh toán qua VietQR để nhận ngay biên lai.", time: "Hôm qua", color: Colors.blue, unread: false },
  { id: "5", icon: "🏠", title: "Chủ nhà phản hồi lịch xem", body: "Chủ nhà xác nhận lịch xem phòng của bạn vào Thứ 7, 10/05/2026 lúc 10:00 sáng.", time: "Hôm qua", color: Colors.cyan, unread: false },
  { id: "6", icon: "📊", title: "Báo cáo thị trường tháng 5", body: "Giá thuê Q.1 tăng 3.2% so với tháng trước. Xem phân tích chi tiết từ AI.", time: "2 ngày trước", color: Colors.emerald, unread: false },
  { id: "7", icon: "🎉", title: "Chào mừng đến NestaVietAI!", body: "Bạn còn 50 lượt tư vấn AI miễn phí. Hãy bắt đầu tìm nhà thuê lý tưởng ngay hôm nay.", time: "1 tuần trước", color: Colors.violet, unread: false },
];

export default function NotificationsScreen() {
  const unreadCount = NOTIFS.filter(n => n.unread).length;

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Thông báo</Text>
          {unreadCount > 0 && <Text style={s.unreadLabel}>{unreadCount} chưa đọc</Text>}
        </View>
        <Pressable style={s.markAllBtn}>
          <Text style={s.markAllText}>Đọc tất cả</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
        {NOTIFS.map((n, i) => (
          <Pressable key={n.id} style={[s.item, i < NOTIFS.length - 1 && s.itemBorder, n.unread && s.itemUnread]}>
            {n.unread && <View style={s.unreadDot} />}
            <View style={[s.iconBox, { backgroundColor: `${n.color}18`, borderColor: `${n.color}35` }]}>
              <Text style={{ fontSize: 20 }}>{n.icon}</Text>
            </View>
            <View style={s.itemBody}>
              <View style={s.itemRow}>
                <Text style={s.itemTitle} numberOfLines={1}>{n.title}</Text>
                <Text style={s.itemTime}>{n.time}</Text>
              </View>
              <Text style={s.itemBody2} numberOfLines={2}>{n.body}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.bg },
  header:      { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 12 },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgCard, alignItems: "center", justifyContent: "center" },
  backText:    { color: Colors.white, fontSize: 20, fontWeight: "600" },
  title:       { color: Colors.white, fontWeight: "800", fontSize: Font.md },
  unreadLabel: { color: Colors.cyan, fontSize: Font.xs, marginTop: 1 },
  markAllBtn:  { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  markAllText: { color: Colors.textMuted, fontSize: Font.xs, fontWeight: "600" },
  list:        { paddingBottom: 32 },
  item:        { flexDirection: "row", padding: 16, gap: 14, alignItems: "flex-start", position: "relative" },
  itemBorder:  { borderBottomWidth: 1, borderBottomColor: Colors.border },
  itemUnread:  { backgroundColor: "rgba(34,211,238,0.03)" },
  unreadDot:   { position: "absolute", top: 20, left: 6, width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.cyan },
  iconBox:     { width: 46, height: 46, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  itemRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 },
  itemTitle:   { flex: 1, color: Colors.white, fontWeight: "700", fontSize: Font.sm, marginRight: 8 },
  itemTime:    { color: Colors.textDim, fontSize: 11, flexShrink: 0 },
  itemBody:    { flex: 1 },
  itemBody2:   { color: Colors.textMuted, fontSize: Font.xs, lineHeight: 18 },
});
