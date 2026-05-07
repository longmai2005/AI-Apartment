import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { router, Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Font, Radius } from "../../constants/theme";

const MENU_ITEMS = [
  { icon: "🏠", label: "Phòng đang thuê",   sub: "Smart Concierge · Báo sự cố & hỗ trợ",      route: "/(tabs)/chat?agent=concierge" },
  { icon: "📄", label: "Hợp đồng của tôi",  sub: "Contract Agent · Xem & ký hợp đồng",         route: "/(tabs)/chat?agent=contract"  },
  { icon: "💳", label: "Thanh toán",          sub: "Contract Agent · VietQR & lịch sử hóa đơn", route: "/(tabs)/chat?agent=contract"  },
  { icon: "🔔", label: "Thông báo",           sub: "Cài đặt thông báo",                          route: "/notifications"               },
  { icon: "🛡️", label: "Bảo mật & quyền riêng tư", sub: "Đổi mật khẩu, 2FA",               route: null                           },
  { icon: "❓", label: "Hỗ trợ",              sub: "Smart Concierge · Liên hệ & FAQ",            route: "/(tabs)/chat?agent=concierge" },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Tài khoản</Text>

        {/* Avatar card */}
        <View style={s.avatarCard}>
          <View style={s.avatar}><Text style={s.avatarEmoji}>👤</Text></View>
          <View style={s.avatarInfo}>
            <Text style={s.avatarName}>Người dùng</Text>
            <Text style={s.avatarEmail}>Chưa đăng nhập</Text>
          </View>
          <Pressable style={s.editBtn} onPress={() => router.push("/(auth)/tenant-login")}>
            <Text style={s.editText}>Đăng nhập</Text>
          </Pressable>
        </View>

        {/* AI credits */}
        <View style={s.creditCard}>
          <View style={s.creditLeft}>
            <Text style={s.creditEmoji}>🤖</Text>
            <View>
              <Text style={s.creditTitle}>AI Credits</Text>
              <Text style={s.creditSub}>Còn 50 lượt tư vấn miễn phí</Text>
            </View>
          </View>
          <View style={s.creditBadge}><Text style={s.creditBadgeText}>Free</Text></View>
        </View>

        {/* Menu */}
        <View style={s.menu}>
          {MENU_ITEMS.map((item, i) => (
            <Pressable key={i} onPress={() => item.route && router.push(item.route as Href)} style={[s.menuItem, i < MENU_ITEMS.length - 1 && s.menuItemBorder]}>
              <Text style={s.menuIcon}>{item.icon}</Text>
              <View style={s.menuBody}>
                <Text style={s.menuLabel}>{item.label}</Text>
                <Text style={s.menuSub}>{item.sub}</Text>
              </View>
              <Text style={s.menuArrow}>›</Text>
            </Pressable>
          ))}
        </View>

        {/* Role switch */}
        <View style={s.roleSection}>
          <Text style={s.roleSectionTitle}>Chuyển vai trò</Text>
          <View style={s.roleRow}>
            <Pressable style={[s.roleBtn, { borderColor: Colors.emerald }]} onPress={() => router.push("/(auth)/tenant-login")}>
              <Text style={s.roleBtnEmoji}>🏠</Text>
              <Text style={[s.roleBtnText, { color: Colors.emerald }]}>Cư dân</Text>
            </Pressable>
            <Pressable style={[s.roleBtn, { borderColor: Colors.violet }]} onPress={() => router.push("/(auth)/landlord-login")}>
              <Text style={s.roleBtnEmoji}>🏢</Text>
              <Text style={[s.roleBtnText, { color: Colors.violet }]}>Chủ nhà</Text>
            </Pressable>
          </View>
        </View>

        <Text style={s.version}>NestaVietAI v1.0.0 · Made with ❤️ in Vietnam</Text>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: Colors.bg },
  title:           { color: Colors.white, fontSize: Font.xl, fontWeight: "800", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 18, letterSpacing: -0.5 },
  avatarCard:      { marginHorizontal: 20, marginBottom: 14, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: 18, flexDirection: "row", alignItems: "center", gap: 14 },
  avatar:          { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(34,211,238,0.1)", borderWidth: 1.5, borderColor: Colors.cyan, alignItems: "center", justifyContent: "center" },
  avatarEmoji:     { fontSize: 26 },
  avatarInfo:      { flex: 1 },
  avatarName:      { color: Colors.white, fontWeight: "700", fontSize: Font.base },
  avatarEmail:     { color: Colors.textMuted, fontSize: Font.xs, marginTop: 2 },
  editBtn:         { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: "rgba(34,211,238,0.1)", borderWidth: 1, borderColor: Colors.cyan },
  editText:        { color: Colors.cyan, fontWeight: "700", fontSize: Font.xs },
  creditCard:      { marginHorizontal: 20, marginBottom: 18, backgroundColor: "rgba(34,211,238,0.06)", borderRadius: Radius.lg, borderWidth: 1, borderColor: "rgba(34,211,238,0.2)", padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  creditLeft:      { flexDirection: "row", alignItems: "center", gap: 12 },
  creditEmoji:     { fontSize: 26 },
  creditTitle:     { color: Colors.white, fontWeight: "700", fontSize: Font.sm },
  creditSub:       { color: Colors.textMuted, fontSize: Font.xs, marginTop: 2 },
  creditBadge:     { backgroundColor: Colors.cyan, paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full },
  creditBadgeText: { color: Colors.bg, fontWeight: "800", fontSize: Font.xs },
  menu:            { marginHorizontal: 20, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: "hidden", marginBottom: 18 },
  menuItem:        { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  menuItemBorder:  { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon:        { fontSize: 22, width: 32 },
  menuBody:        { flex: 1 },
  menuLabel:       { color: Colors.white, fontWeight: "600", fontSize: Font.sm },
  menuSub:         { color: Colors.textMuted, fontSize: Font.xs, marginTop: 2 },
  menuArrow:       { color: Colors.textDim, fontSize: 22, fontWeight: "300" },
  roleSection:     { marginHorizontal: 20, marginBottom: 18 },
  roleSectionTitle: { color: Colors.textMuted, fontSize: Font.xs, fontWeight: "700", marginBottom: 10, letterSpacing: 0.5 },
  roleRow:         { flexDirection: "row", gap: 12 },
  roleBtn:         { flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, padding: 16, alignItems: "center", gap: 6 },
  roleBtnEmoji:    { fontSize: 28 },
  roleBtnText:     { fontWeight: "700", fontSize: Font.sm },
  version:         { textAlign: "center", color: Colors.textDim, fontSize: Font.xs, paddingHorizontal: 20 },
});
