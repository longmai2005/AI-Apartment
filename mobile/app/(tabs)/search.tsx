import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Font, Radius } from "../../constants/theme";
import { LISTINGS } from "../../constants/listings";

const DISTRICTS = ["Quận 1", "Quận 7", "Bình Thạnh", "Thủ Đức", "Gò Vấp", "Quận 4", "Quận 3", "Quận 10"];
const BUDGETS   = ["Dưới 5tr", "5–8tr", "8–12tr", "Trên 12tr"];

export default function SearchScreen() {
  const [query, setQuery]       = useState("");
  const [district, setDistrict] = useState("");
  const [budget, setBudget]     = useState("");

  const results = LISTINGS.filter(l => {
    const matchQ = !query   || l.title.toLowerCase().includes(query.toLowerCase()) || l.district.toLowerCase().includes(query.toLowerCase());
    const matchD = !district || l.district.includes(district);
    const matchB = !budget   || (() => {
      if (budget === "Dưới 5tr")  return l.priceNum < 5_000_000;
      if (budget === "5–8tr")     return l.priceNum >= 5_000_000  && l.priceNum <= 8_000_000;
      if (budget === "8–12tr")    return l.priceNum > 8_000_000   && l.priceNum <= 12_000_000;
      if (budget === "Trên 12tr") return l.priceNum > 12_000_000;
      return true;
    })();
    return matchQ && matchD && matchB;
  });

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Tìm kiếm nâng cao</Text>

        {/* Search bar */}
        <View style={s.searchBox}>
          <Text>🔍 </Text>
          <TextInput
            style={s.searchInput}
            placeholder="Khu vực, tiêu đề, loại phòng..."
            placeholderTextColor={Colors.textDim}
            value={query}
            onChangeText={setQuery}
          />
          {query !== "" && (
            <Pressable onPress={() => setQuery("")}><Text style={{ color: Colors.textMuted }}>✕</Text></Pressable>
          )}
        </View>

        {/* District filter */}
        <Text style={s.filterLabel}>Khu vực</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          {DISTRICTS.map(d => (
            <Pressable key={d} onPress={() => setDistrict(district === d ? "" : d)} style={[s.chip, district === d && s.chipActive]}>
              <Text style={[s.chipText, district === d && s.chipTextActive]}>📍 {d}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Budget filter */}
        <Text style={[s.filterLabel, { marginTop: 16 }]}>Ngân sách</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          {BUDGETS.map(b => (
            <Pressable key={b} onPress={() => setBudget(budget === b ? "" : b)} style={[s.chip, budget === b && s.chipActive]}>
              <Text style={[s.chipText, budget === b && s.chipTextActive]}>💰 {b}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Results */}
        <View style={s.resultsHeader}>
          <Text style={s.resultsCount}>{results.length} kết quả</Text>
          {(query || district || budget) && (
            <Pressable onPress={() => { setQuery(""); setDistrict(""); setBudget(""); }}>
              <Text style={{ color: Colors.cyan, fontSize: Font.sm }}>Xóa bộ lọc</Text>
            </Pressable>
          )}
        </View>

        <View style={s.list}>
          {results.map(l => (
            <Pressable key={l.id} onPress={() => router.push(`/listing/${l.id}`)} style={s.row}>
              <Image source={{ uri: l.image }} style={s.rowImg} />
              <View style={s.rowBody}>
                <Text style={s.rowTitle} numberOfLines={1}>{l.title}</Text>
                <Text style={s.rowPrice}>{l.price}</Text>
                <Text style={s.rowMeta} numberOfLines={1}>📍 {l.district} · {l.area}</Text>
                {l.verified && <Text style={s.rowVerified}>✅ AI Verified</Text>}
              </View>
            </Pressable>
          ))}
          {results.length === 0 && (
            <View style={s.empty}>
              <Text style={s.emptyEmoji}>🔍</Text>
              <Text style={s.emptyText}>Không tìm thấy kết quả</Text>
              <Text style={s.emptySub}>Thử điều chỉnh bộ lọc hoặc hỏi AI</Text>
              <Pressable onPress={() => router.push("/(tabs)/chat")} style={s.emptyBtn}>
                <Text style={s.emptyBtnText}>🤖 Hỏi Super Broker AI</Text>
              </Pressable>
            </View>
          )}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.bg },
  title:        { color: Colors.white, fontSize: Font.xl, fontWeight: "800", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 18, letterSpacing: -0.5 },
  searchBox:    { marginHorizontal: 20, marginBottom: 20, flexDirection: "row", alignItems: "center", backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12 },
  searchInput:  { flex: 1, color: Colors.text, fontSize: Font.base },
  filterLabel:  { color: Colors.textMuted, fontSize: Font.xs, fontWeight: "700", paddingHorizontal: 20, marginBottom: 10, letterSpacing: 0.5 },
  chip:         { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  chipActive:   { backgroundColor: "rgba(34,211,238,0.12)", borderColor: Colors.cyan },
  chipText:     { color: Colors.textMuted, fontSize: Font.sm },
  chipTextActive: { color: Colors.cyan, fontWeight: "700" },
  resultsHeader: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 20, marginBottom: 12 },
  resultsCount: { color: Colors.white, fontWeight: "700", fontSize: Font.base },
  list:         { paddingHorizontal: 20, gap: 12 },
  row:          { flexDirection: "row", backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: "hidden", gap: 14 },
  rowImg:       { width: 100, height: 100 },
  rowBody:      { flex: 1, paddingVertical: 12, paddingRight: 14, justifyContent: "center", gap: 3 },
  rowTitle:     { color: Colors.white, fontWeight: "700", fontSize: Font.sm },
  rowPrice:     { color: Colors.cyan, fontWeight: "800", fontSize: Font.base },
  rowMeta:      { color: Colors.textMuted, fontSize: Font.xs },
  rowVerified:  { color: Colors.emerald, fontSize: Font.xs, fontWeight: "700" },
  empty:        { alignItems: "center", paddingVertical: 48 },
  emptyEmoji:   { fontSize: 48, marginBottom: 12 },
  emptyText:    { color: Colors.white, fontWeight: "700", fontSize: Font.md },
  emptySub:     { color: Colors.textMuted, fontSize: Font.sm, marginTop: 4, marginBottom: 16 },
  emptyBtn:     { backgroundColor: "rgba(34,211,238,0.1)", borderWidth: 1, borderColor: "rgba(34,211,238,0.3)", paddingHorizontal: 20, paddingVertical: 12, borderRadius: Radius.full },
  emptyBtnText: { color: Colors.cyan, fontWeight: "700", fontSize: Font.sm },
});
