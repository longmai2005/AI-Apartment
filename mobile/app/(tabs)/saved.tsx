import { View, Text, StyleSheet, Pressable, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Font, Radius } from "../../constants/theme";
import { LISTINGS } from "../../constants/listings";
import { toggleSave, useSaved } from "../../constants/savedStore";

export default function SavedScreen() {
  const savedIds = useSaved();
  const savedListings = LISTINGS.filter(l => savedIds.has(l.id));

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.title}>Đã lưu</Text>
        {savedListings.length > 0 && (
          <Text style={s.count}>{savedListings.length} tin</Text>
        )}
      </View>

      {savedListings.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emoji}>❤️</Text>
          <Text style={s.emptyTitle}>Chưa có tin nào đã lưu</Text>
          <Text style={s.emptySub}>Nhấn ❤️ trên tin đăng để lưu lại và so sánh sau</Text>
          <Pressable style={s.btn} onPress={() => router.push("/(tabs)/")}>
            <Text style={s.btnText}>Khám phá ngay</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
          {savedListings.map(l => (
            <Pressable key={l.id} onPress={() => router.push(`/listing/${l.id}`)} style={s.card}>
              <Image source={{ uri: l.image }} style={s.cardImage} />
              <View style={s.cardBody}>
                <Text style={s.cardTitle} numberOfLines={1}>{l.title}</Text>
                <Text style={s.cardPrice}>{l.price}</Text>
                <Text style={s.cardMeta} numberOfLines={1}>📍 {l.district} · {l.area}</Text>
                <View style={s.cardFooter}>
                  {l.verified && <Text style={s.verified}>✅ AI Verified</Text>}
                  <Text style={s.rating}>⭐ {l.rating}</Text>
                </View>
              </View>
              <Pressable onPress={() => toggleSave(l.id)} style={s.removeBtn}>
                <Text style={{ fontSize: 18 }}>❤️</Text>
              </Pressable>
            </Pressable>
          ))}

          {/* Compare hint */}
          {savedListings.length >= 2 && (
            <View style={s.compareBanner}>
              <Text style={s.compareEmoji}>🤖</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.compareTitle}>So sánh bằng AI</Text>
                <Text style={s.compareSub}>Hỏi Super Broker AI để so sánh {savedListings.length} tin đã lưu</Text>
              </View>
              <Pressable onPress={() => router.push("/(tabs)/chat")} style={s.compareBtn}>
                <Text style={s.compareBtnText}>Hỏi AI</Text>
              </Pressable>
            </View>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.bg },
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 18 },
  title:        { color: Colors.white, fontSize: Font.xl, fontWeight: "800", letterSpacing: -0.5 },
  count:        { color: Colors.textMuted, fontSize: Font.sm },
  empty:        { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  emoji:        { fontSize: 56, marginBottom: 16 },
  emptyTitle:   { color: Colors.white, fontWeight: "700", fontSize: Font.md, textAlign: "center" },
  emptySub:     { color: Colors.textMuted, fontSize: Font.sm, textAlign: "center", marginTop: 8, marginBottom: 24, lineHeight: 20 },
  btn:          { backgroundColor: Colors.cyan, paddingHorizontal: 24, paddingVertical: 14, borderRadius: Radius.full },
  btnText:      { color: Colors.bg, fontWeight: "800", fontSize: Font.sm },
  list:         { paddingHorizontal: 20, gap: 14 },
  card:         { flexDirection: "row", backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: "hidden", gap: 14 },
  cardImage:    { width: 110, height: 110 },
  cardBody:     { flex: 1, paddingVertical: 12, paddingRight: 10, justifyContent: "center", gap: 4 },
  cardTitle:    { color: Colors.white, fontWeight: "700", fontSize: Font.sm },
  cardPrice:    { color: Colors.cyan, fontWeight: "800", fontSize: Font.base },
  cardMeta:     { color: Colors.textMuted, fontSize: Font.xs },
  cardFooter:   { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 2 },
  verified:     { color: Colors.emerald, fontSize: Font.xs, fontWeight: "700" },
  rating:       { color: Colors.textMuted, fontSize: Font.xs },
  removeBtn:    { padding: 14, alignSelf: "center", marginRight: 4 },
  compareBanner: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(34,211,238,0.06)", borderRadius: Radius.lg, borderWidth: 1, borderColor: "rgba(34,211,238,0.2)", padding: 14, marginTop: 6 },
  compareEmoji: { fontSize: 28 },
  compareTitle: { color: Colors.white, fontWeight: "700", fontSize: Font.sm },
  compareSub:   { color: Colors.textMuted, fontSize: Font.xs, marginTop: 2 },
  compareBtn:   { backgroundColor: Colors.cyan, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full },
  compareBtnText: { color: Colors.bg, fontWeight: "800", fontSize: Font.xs },
});
